'use strict';

require('neon');

var _ = require('lodash');
var Promise = require('bluebird');

var DomainContainer = Class({}, 'DomainContainer')({

  prototype: {

    _knex: null,
    _models: null,
    _customProps: {},
    presenters: {},

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

      if (!_.isUndefined(initProps.customProps)) {
        that._customProps = initProps.customProps;
      }

      if (!_.isUndefined(initProps.presenters)) {
        that.presenters = initProps.presenters;
      }
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

      var model = new Model(that._customProps);
      model.updateAttributes(body);

      return model.save(that._knex)
        .then(function () {
          return model;
        });
    },

    update: function (model, body) {
      var that = this;

      _.extend(model, that._customProps);

      model.updateAttributes(body);

      return model.save(that._knex)
        .then(function () {
          return model;
        });
    },

    destroy: function (model) {
      var that = this;

      _.extend(model, that._customProps);

      return model.destroy(that._knex)
        .then(function () {
          return model;
        });
    },

  },

});

module.exports = DomainContainer;
