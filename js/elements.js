/**
 * Single element
 * @param key
 * @constructor
 */
function Element(key) {
 this.key = key;
}

Element.prototype.set = function (attribute, value) {
  this.attribute = value;
  return this;
}
Element.prototype.get = function (attribute, value) {
  return this.attribute = value;
}


/**
 * Collection of elements
 * @param elements
 * @constructor
 */
var Elements = function (elements) {
  this.elements = {}
}

Elements.prototype.toArray = function() {
  var linear = [];
  for (var key in this.elements) {
    linear.push(this.elements[key])
  }
  return linear;
}

Elements.prototype.getElement = function (key, properties) {
  key = this.cleanKey(key)
  // if (!key) throw new Error("Element key cannot be null")
  if (!this.elements[key]) this.elements[key] = new Element(key);

  var el = this.elements[key]
  if (properties && typeof properties == 'object') {
    for (var attr in properties) el[attr] = properties[attr]
  }
  return el
}

Elements.prototype.hasElement = function (key) {
  key = this.cleanKey(key)
  return (this.elements[key]) ? true : false;
}

Elements.prototype.cleanKey =
  function (key) {
  if (!key) return key;
  return key.replace(/&[^ ;]+;/, '').replace(/[^a-zA-Z0-9-$.:]/g, '_')
}

Elements.prototype.uniquifyElementKey = function (key) {
  key = this.cleanKey(key)

  var index = 0;
  var newKey = key;
  while (this.hasElement(newKey)) {
    newKey = key + "." + (++index)
  }
  return newKey;
}

Elements.Element = Element;

module.exports = Elements