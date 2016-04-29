'use strict';

require('neon');
require('krypton-orm');

var _ = require('lodash');
var Promise = require('bluebird');

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

      if (_.isUndefined(initProps.models) || !_.isObject(initProps.models)) {
        throw new Error('initProps.models property is required and should be an object');
      }

      that._models = initProps.models;

      that._modelExtras = initProps.modelExtras || {};
      that.presenters = initProps.presenters || {};
      that.props = initProps.props || {};
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

      return model.save(that._knex)
        .then(function () {
          return model;
        });
    },

    update: function (model, body) {
      var that = this;

      model.updateAttributes(body);

      model._modelExtras = that._modelExtras;

      return model.save(that._knex)
        .then(function () {
          return model;
        });
    },

    destroy: function (model) {
      var that = this;

      model._modelExtras = that._modelExtras;

      return model.destroy(that._knex)
        .then(function () {
          return model;
        });
    },

    get: function (modelName) {
      var that = this;

      var temp = Class({}, 'ContainerTemporaryModel').inherits(Krypton.Model)({
        prototype: {
          _modelExtras: that._modelExtras,
          _container: that,
        },
      });

      temp.knex(that._knex);

      return Class({}, modelName).inherits(temp)({});
    },

  },

});

module.exports = DomainContainer;
