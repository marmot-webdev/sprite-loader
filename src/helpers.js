const getType = value => Object.prototype.toString.call(value).slice(8, -1);

const isObject = value => getType(value) === 'Object';

function mergeObjects(target, ...sources) {
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
  return elem.dataset[attrName]?.trim() ?? null;
}

export { createContainer, getDataAttrValue, mergeObjects };