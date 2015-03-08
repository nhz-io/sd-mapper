(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BaseContext;

module.exports = BaseContext = (function() {
  function BaseContext(parent) {
    this.parent = null;
    this.root = this;
    this.items = [];
    this.keys = [];
    this.count = {};
    if (parent) {
      this.parent = parent;
      this.root = this.parent.root;
    }
  }

  BaseContext.prototype.ref = function(data) {
    var count, key;
    if (!((data != null) || data instanceof Object)) {
      return;
    }
    count = 0;
    for (key in data) {
      if (++count > 1) {
        return;
      }
    }
    if (key !== '$') {
      return;
    }
    return data.$;
  };

  BaseContext.prototype.has = function(data) {
    var i, ref;
    if (-1 !== (i = this.items.indexOf(data))) {
      return this.keys[i];
    }
    return (ref = this.parent) != null ? ref.has(data) : void 0;
  };

  BaseContext.prototype.get = function(key) {
    var i, ref;
    if (-1 !== (i = this.keys.indexOf(key))) {
      return this.items[i];
    }
    return (ref = this.parent) != null ? ref.get(key) : void 0;
  };

  BaseContext.prototype.put = function(data, key) {
    this.keys.push(key);
    this.items.push(data);
    this.count[key] = 1;
    return [key, 1];
  };

  BaseContext.prototype.add = function(data) {
    var key;
    if (key = this.has(data)) {
      this.count[key]++;
    } else {
      key = Math.random().toString(36).substr(2);
      this.count[key] = 1;
      this.keys.push(key);
      this.items.push(data);
    }
    return [key, this.count[key]];
  };

  BaseContext.prototype.remove = function(data) {
    var count, i, key;
    if (key = this.has(data)) {
      count = --this.count[key];
      if (count === 0) {
        i = this.keys.indexOf(key);
        this.keys.splice(i, 1);
        this.items.splice(i, 1);
        delete this.count[key];
      }
      return [key, count];
    }
  };

  return BaseContext;

})();

},{}],2:[function(require,module,exports){
var BaseContext, DeserializerContext,
  extend = require("extends__"),
  hasProp = {}.hasOwnProperty;

BaseContext = require('./base');

module.exports = DeserializerContext = (function(superClass) {
  extend(DeserializerContext, superClass);

  function DeserializerContext(parentContext, data) {
    DeserializerContext.__super__.constructor.call(this, parentContext);
    if (arguments.length > 1) {
      this.populate(data);
      this.resolve();
    }
  }

  DeserializerContext.prototype.populate = function(data) {
    var item, j, k, key, len, len1, ref, ref1, result, value;
    if (data == null) {
      return data;
    }
    if ((ref1 = typeof data) === 'string' || ref1 === 'boolean' || ref1 === 'number') {
      return data;
    }
    if (data instanceof RegExp) {
      return data;
    }
    if (data instanceof Array) {
      result = [];
      for (j = 0, len = data.length; j < len; j++) {
        item = data[j];
        result.push(this.populate(item));
      }
      return result;
    }
    if (!(data instanceof Object)) {
      return data;
    }
    if (ref = this.ref(data)) {
      if (!(ref instanceof Array)) {
        return data;
      }
      key = ref[0], value = ref[1];
      if (value instanceof Array) {
        result = [];
        this.put(result, key);
        for (k = 0, len1 = value.length; k < len1; k++) {
          item = value[k];
          result.push(this.populate(item));
        }
        return result;
      }
      if (value instanceof Object) {
        result = {};
        this.put(result, key);
        for (key in value) {
          item = value[key];
          result[key] = this.populate(item);
        }
        return result;
      }
    } else {
      result = {};
      for (key in data) {
        item = data[key];
        result[key] = this.populate(item);
      }
      return result;
    }
  };

  DeserializerContext.prototype.resolve = function(data) {
    var i, item, j, key, len, ref, ref1;
    if (arguments.length === 0) {
      data = this.items;
    }
    switch (false) {
      case !(data == null):
        return data;
      case (ref1 = typeof data) !== 'string' && ref1 !== 'boolean' && ref1 !== 'number':
        return data;
      case !(data instanceof RegExp):
        return data;
      case !(data instanceof Array):
        for (i = j = 0, len = data.length; j < len; i = ++j) {
          item = data[i];
          data[i] = this.resolve(item);
        }
        return data;
      case !(data instanceof Object):
        if ((ref = this.ref(data)) && typeof ref === 'string') {
          item = this.get(ref);
          return (this.get(ref)) || data;
        }
        for (key in data) {
          item = data[key];
          data[key] = this.resolve(item);
        }
        return data;
    }
    return data;
  };

  return DeserializerContext;

})(BaseContext);

},{"./base":1,"extends__":7}],3:[function(require,module,exports){
var BaseContext, SerializerContext,
  extend = require("extends__"),
  hasProp = {}.hasOwnProperty;

BaseContext = require('./base');

module.exports = SerializerContext = (function(superClass) {
  extend(SerializerContext, superClass);

  function SerializerContext() {
    return SerializerContext.__super__.constructor.apply(this, arguments);
  }

  return SerializerContext;

})(BaseContext);

},{"./base":1,"extends__":7}],4:[function(require,module,exports){
var Context, Deserializer;

Context = require('./context/deserializer');

module.exports = Deserializer = (function() {
  Deserializer.Context = Context;

  function Deserializer(parentContext) {
    this.context = new Context(parentContext);
  }

  Deserializer.prototype.deserialize = function(data, context) {
    var i, item, key, len, ref, ref1, result;
    context || (context = this.context);
    if (data == null) {
      return data;
    }
    if ((ref1 = typeof data) === 'boolean' || ref1 === 'number' || ref1 === 'string' || ref1 === 'function') {
      return data;
    }
    if (data instanceof RegExp) {
      return data;
    }
    if (data instanceof Array) {
      result = [];
      for (i = 0, len = data.length; i < len; i++) {
        item = data[i];
        result.push(this.deserialize(data, context));
      }
      return result;
    }
    if (data instanceof Object) {
      if (ref = context.ref(data)) {
        key = ref instanceof Array ? ref[0] : ref;
        return (context.get(key)) || data;
      }
      result = {};
      for (key in data) {
        item = data[key];
        result[key] = this.deserialize(item, context);
      }
      return result;
    }
    return data;
  };

  return Deserializer;

})();

},{"./context/deserializer":2}],5:[function(require,module,exports){
var BaseContext, Deserializer, Serializer;

Serializer = require('./serializer');

Deserializer = require('./deserializer');

BaseContext = require('./context/base');

window.SDM = {
  Serializer: Serializer,
  Deserializer: Deserializer,
  BaseContext: BaseContext,
  SerializerContext: Serializer.Context,
  DeserializerContext: Deserializer.Context,
  serializer: function(context) {
    var serializer;
    serializer = new Serializer(context);
    return function(data) {
      context = new Serializer.Context(serializer.context);
      data = serializer.serialize(data, context);
      return serializer.compact(data, context);
    };
  },
  deserializer: function(context) {
    var deserializer;
    deserializer = new Deserializer(context);
    return function(data) {
      context = new Deserializer.Context(deserializer.context, data);
      return deserializer.deserialize(data, context);
    };
  }
};

},{"./context/base":1,"./deserializer":4,"./serializer":6}],6:[function(require,module,exports){
var Context, Serializer;

Context = require('./context/serializer');

module.exports = Serializer = (function() {
  Serializer.Context = Context;

  function Serializer(parentContext) {
    this.context = new Context(parentContext);
  }

  Serializer.prototype.serialize = function(data, context) {
    var _key, count, item, j, key, len, ref1, result, type;
    if (data == null) {
      return data;
    }
    if ((type = typeof data) === 'function') {
      return void 0;
    }
    if (type === 'string' || type === 'boolean' || type === 'number') {
      return data;
    }
    if (data instanceof RegExp) {
      return data;
    }
    ref1 = context.add(data), key = ref1[0], count = ref1[1];
    if (count > 1) {
      return {
        $: key
      };
    }
    if (data instanceof Array) {
      result = [];
      for (j = 0, len = data.length; j < len; j++) {
        item = data[j];
        if (item instanceof Function) {
          continue;
        }
        result.push(this.serialize(item, context));
      }
      return {
        $: [key, result]
      };
    }
    if (data instanceof Object) {
      result = {};
      for (_key in data) {
        item = data[_key];
        if (item instanceof Function) {
          continue;
        }
        result[_key] = this.serialize(item, context);
      }
      return {
        $: [key, result]
      };
    }
    return void 0;
  };

  Serializer.prototype.compact = function(data, context) {
    var count, i, item, j, key, len, ref, result, type, value;
    if (data == null) {
      return data;
    }
    if ((type = typeof data) === 'function') {
      return void 0;
    }
    if (type === 'string' || type === 'boolean' || type === 'number') {
      return data;
    }
    if (data instanceof RegExp) {
      return data;
    }
    if (!(ref = context.ref(data))) {
      return data;
    }
    if (!(ref instanceof Array)) {
      return data;
    }
    key = ref[0], value = ref[1];
    count = context.count[key] || 1;
    result = count === 1 ? value : data;
    switch (false) {
      case typeof value !== 'string':
        return result;
      case !(value instanceof Array):
        for (i = j = 0, len = value.length; j < len; i = ++j) {
          item = value[i];
          value[i] = this.compact(item, context);
        }
        break;
      case !(value instanceof Object):
        for (key in value) {
          item = value[key];
          value[key] = this.compact(item, context);
        }
    }
    return result;
  };

  return Serializer;

})();

},{"./context/serializer":3}],7:[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = function(ChildClass, ParentClass) {
  return extend(ChildClass, ParentClass);
};

},{}]},{},[5])