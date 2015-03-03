var DSUtils = require('../../utils');
var DSErrors = require('../../errors');

function updateAll(resourceName, attrs, params, options) {
  var _this = this;
  var definition = _this.defs[resourceName];

  return new DSUtils.Promise(function (resolve, reject) {
    if (!definition) {
      reject(new DSErrors.NER(resourceName));
    } else {
      options = DSUtils._(definition, options);
      options.logFn('updateAll', attrs, params, options);
      resolve(attrs);
    }
  }).then(function (attrs) {
      return options.beforeValidate.call(attrs, options, attrs);
    })
    .then(function (attrs) {
      return options.validate.call(attrs, options, attrs);
    })
    .then(function (attrs) {
      return options.afterValidate.call(attrs, options, attrs);
    })
    .then(function (attrs) {
      return options.beforeUpdate.call(attrs, options, attrs);
    })
    .then(function (attrs) {
      if (options.notify) {
        definition.emit('DS.beforeUpdate', definition, attrs);
      }
      return _this.getAdapter(options).updateAll(definition, attrs, params, options);
    })
    .then(function (data) {
      return options.afterUpdate.call(data, options, data);
    })
    .then(function (data) {
      if (options.notify) {
        definition.emit('DS.afterUpdate', definition, attrs);
      }
      if (options.cacheResponse) {
        var injected = _this.inject(definition.n, data, options);
        var resource = _this.s[resourceName];
        DSUtils.forEach(injected, function (i) {
          var id = i[definition.idAttribute];
          resource.saved[id] = DSUtils.updateTimestamp(resource.saved[id]);
          if (!definition.resetHistoryOnInject) {
            resource.previousAttributes[id] = DSUtils.copy(i);
          }
        });
        return injected;
      } else {
        var instances = [];
        DSUtils.forEach(data, function (item) {
          instances.push(_this.createInstance(resourceName, item, options));
        });
        return instances;
      }
    });
}

module.exports = updateAll;
