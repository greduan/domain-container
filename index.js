'use strict';

require('neon');

var _ = require('lodash');

var ModelsWrapper = Class({}, 'ModelsWrapper')({

  prototype: {

    _knex: null,
    _models: null,
    _customProps: {},
    presenters: {},

    init: function (initProps) {
      var that = this;
      
      that._knex = initProps.knex;
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

      if (!Model) {
        throw new Error('Model ' + modelName + ' doesn\'t exist in the ModelsWrapper');
      }

      return Model.query(that._knex);
    },

    create: function (modelName, body) {
      var that = this;

      var Model = that._models[modelName];

      if (!Model) {
        throw new Error('Model ' + modelName + ' doesn\'t exist in the ModelsWrapper');
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
      
      model.updateAttributes(body);

      return model.save(that._knex)
        .then(function () {
          return model;
        });
    },

    destroy: function (model) {
      var that = this;
      
      return model.destroy(that._knex)
        .then(function () {
          return model;
        });
    },

  },

});

module.exports = ModelsWrapper;
