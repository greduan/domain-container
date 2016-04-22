'use strict';

var expect = require('expect.js');

var ModelsWrapper = require('./..');

require('krypton-orm');

var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'models-wrapper-test',
  },
});

var Foo = Class({}, 'Foo').inherits(Krypton.Model)({
  tableName: 'foo',
  validations: {},
  attributes: ['id', 'one', 'two'],
});

var models = {
  Foo: Foo,
};

describe('ModelsWrapper', function () {

  describe('Instantiation', function () {

    it('Should instantiate with no errors', function (doneTest) {
      var func = function () {
        var wrapper = new ModelsWrapper({
          knex: knex,
          models: models,
          customProps: {},
          presenters: {},
        });
      };

      expect(func).to.not.throw;

      return doneTest();
    });

    it('Should instantiate with no errors when not provided optional params', function (doneTest) {
      var func = function () {
        var wrapper = new ModelsWrapper({
          knex: knex,
          models: models,
        });
      };

      expect(func).to.not.throw;

      return doneTest();
    });
    
  });

  describe('#query', function () {
    
  });

  describe('#create', function () {
    
  });

  describe('#update', function () {
    
  });

  describe('#destroy', function () {
    
  });
  
});
