'use strict';

if (global.Class == null || global.Module == null) {
  require('neon');
}

if (global.Krypton == null) {
  require('krypton-orm');
}

var _ = require('lodash');
var Promise = require('bluebird');

var generateContainerModels = function (models, container) {
  var result = {};

  Object.keys(models).forEach(function (key) {
    var Model = models[key];

    var TmpModel = Class({}, key)
      .inherits(Model)({
        _modelExtras: container._modelExtras,
        _container: container,

        prototype: {
          _modelExtras: container._modelExtras,
          _container: container,
        },
      });

    TmpModel.knex(container._knex);

    result[key] = TmpModel;
  });

  return result;
};

var DomainContainer = Class({}, 'DomainContainer')({

  prototype: {

    _knex: null,
    _models: null,
    _modelExtras: null,
    presenters: null,
    props: null,

    init: function (initProps) {
      var that = this;

      if (_.isUndefined(initProps.knex)) {
        throw new Error('initProps.knex property is required');
      }

      that._knex = initProps.knex;

      that._modelExtras = initProps.modelExtras || {};
      that.presenters = initProps.presenters || {};
      that.props = initProps.props || {};

      if (_.isUndefined(initProps.models) || !_.isObject(initProps.models)) {
        throw new Error('initProps.models property is required and should be an object');
      }

      that._models = generateContainerModels(initProps.models, that);
    },

    query: function (modelName) {
      var that = this;

      var Model = that._models[modelName];

      if (_.isUndefined(Model)) {
        return Promise.reject(new Error('Model ' + modelName + ' doesn\'t exist in the DomainContainer'));
      }

      return Model.query(that._knex);
    },

    create: function (modelName, body) {
      var that = this;

      var Model = that._models[modelName];

      if (_.isUndefined(Model)) {
        return Promise.reject(new Error('Model ' + modelName + ' doesn\'t exist in the DomainContainer'));
      }

      var model = new Model(body);
      model._modelExtras = that._modelExtras;
      model._container = that;

      return model.save()
        .then(function () {
          return model;
        });
    },

    update: function (model, body) {
      var that = this;

      model.updateAttributes(body || {});

      model._modelExtras = that._modelExtras;
      model._container = that;

      return model.save()
        .then(function () {
          return model;
        });
    },

    destroy: function (model) {
      var that = this;

      model._modelExtras = that._modelExtras;
      model._container = that;

      return model.destroy(that._knex)
        .then(function () {
          return model;
        });
    },

    get: function (modelName) {
      var that = this;

      var Model = that._models[modelName];

      if (_.isUndefined(Model)) {
        return Promise.reject(new Error('Model ' + modelName + ' doesn\'t exist in the DomainContainer'));
      }

      return Model;
    },

    cleanup: function () {
      var that = this;

      return new Promise(function (resolve, reject) {
        that._knex.destroy(function () {
          resolve();
        });
      });
    },

  },

});

module.exports = DomainContainer;
