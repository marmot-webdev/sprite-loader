/**!
 * sprite-loader
 * @version: 1.0.0
 * @author: Serhii Babakov <marmot.webdev@gmail.com>
 * @url: https://github.com/marmot-webdev/sprite-loader
 * @license: MIT
 */

var SpriteLoader = (function() {
  'use strict';

  const getType = value => Object.prototype.toString.call(value).slice(8, -1);
  const isObject = value => getType(value) === 'Object';

  function mergeObjects(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }
    if (!sources.length) {
      return target;
    }
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
      for (const [key, value] of Object.entries(source)) {
        target[key] = isObject(value) ? mergeObjects(target[key] || {}, value) : value;
      }
    }
    return mergeObjects(target, ...sources);
  }

  function createContainer() {
    const container = document.createElement('div');
    container.hidden = true;
    document.body.prepend(container);
    return container;
  }

  function getDataAttrValue(elem, attrName) {
    var _elem$dataset$attrNam, _elem$dataset$attrNam2;
    return (_elem$dataset$attrNam = (_elem$dataset$attrNam2 = elem.dataset[attrName]) === null || _elem$dataset$attrNam2 === void 0 ? void 0 : _elem$dataset$attrNam2.trim()) !== null && _elem$dataset$attrNam !== void 0 ? _elem$dataset$attrNam : null;
  }

  var defaultOptions = {
    container: null,
    extractor: null,
    sprites: {
      global: [],
      local: []
    },
    root: '',
    dirname: '',
    extname: '.svg',
    prefix: '',
    onload: null
  };

  class SpriteLoader {
    constructor() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.options = mergeObjects({}, defaultOptions, options);
      this.container = this.getContainer();
      this.initialize();
    }
    initialize() {
      const {
        onload
      } = this.options;
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
      const {
        container
      } = this.options;
      return typeof container === 'function' ? container() : createContainer();
    }
    getOption(config, option) {
      return config[option] || this.options[option];
    }
    getConfigs() {
      var _getDataAttrValue;
      const {
        extractor,
        sprites
      } = this.options;
      const localNames = typeof extractor === 'function' ? extractor() : ((_getDataAttrValue = getDataAttrValue(document.documentElement, 'sprites')) === null || _getDataAttrValue === void 0 ? void 0 : _getDataAttrValue.split('|')) || [];
      return [...sprites.global, ...sprites.local.filter(config => localNames.some(name => config.basename.startsWith(name + this.getOption(config, 'extname'))))].map(config => {
        const {
          basename,
          onload
        } = config;
        const storageKey = this.getOption(config, 'prefix') + basename;
        const root = this.getOption(config, 'root') || document.baseURI;
        const dirname = this.getOption(config, 'dirname');
        const delimiter = dirname.endsWith('/') ? '' : '/';
        const path = dirname + delimiter + basename;
        const url = new URL(path, root);
        return {
          url,
          storageKey,
          ...(onload && {
            onload
          })
        };
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

  return SpriteLoader;

})();