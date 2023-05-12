import { createContainer, getDataAttrValue, mergeObjects } from './helpers.js';
import defaultOptions from './defaults.js';

export default class SpriteLoader {
  constructor(options = {}) {
    this.options = mergeObjects({}, defaultOptions, options);
    this.container = this.getContainer();
    this.initialize();
  }

  initialize() {
    const { onload } = this.options;
    const configs = this.getConfigs();
    const missingSpriteConfigs = this.getMissingSpriteConfigs(configs);

    if (missingSpriteConfigs.length) {
      this.loadSprites(missingSpriteConfigs);
    }

    if (typeof onload === 'function') {
      onload(configs.map(config => config.url));
    }
  }

  getContainer() {
    const { container } = this.options;
    return (typeof container === 'function') ? container() : createContainer();
  }

  getOption(config, option) {
    return config[option] || this.options[option];
  }

  getConfigs() {
    const { extractor, sprites } = this.options;

    const localNames = typeof extractor === 'function' ? extractor() :
      (getDataAttrValue(document.documentElement, 'sprites')?.split('|') || []);

    return [
      ...sprites.global,
      ...sprites.local.filter(config =>
        localNames.some(name => config.basename.startsWith(name + this.getOption(config, 'extname')))
      )
    ].map(config => {
      const { basename, onload } = config;
      const storageKey = this.getOption(config, 'prefix') + basename;
      const root = this.getOption(config, 'root') || document.baseURI;
      const dirname = this.getOption(config, 'dirname');
      const delimiter = dirname.endsWith('/') ? '' : '/';
      const path = dirname + delimiter + basename;
      const url = new URL(path, root);

      return { url, storageKey, ...(onload && { onload }) };
    });
  }

  getMissingSpriteConfigs(configs) {
    const missingSpriteConfigs = [];

    for (const config of configs) {
      const value = localStorage.getItem(config.storageKey);

      if (value) {
        this.insertSprite(value, config);
      } else {
        missingSpriteConfigs.push(config);
      }
    }

    return missingSpriteConfigs;
  }

  insertSprite(content, config) {
    this.container.insertAdjacentHTML('beforeend', content);

    if (typeof config.onload === 'function') {
      config.onload(config.url);
    }
  }

  async loadSprites(configs) {
    try {
      const responses = await Promise.all(configs.map(config => fetch(config.url.href)));
      const responseEntries = responses.entries();

      for (const [index, response] of responseEntries) {
        if (response.ok) {
          const content = await response.text();
          const config = configs[index];

          this.insertSprite(content, config);
          localStorage.setItem(config.storageKey, content);
        }
      }
    } catch (error) {
      console.error(`Error loading sprite: ${error}`);
    }
  }
}