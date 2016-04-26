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

var Bar = Class({}, 'Bar').inherits(Krypton.Model)({
  tableName: 'bar',
  validations: {
    fooId: ['required'],
  },
  attributes: ['id', 'fooId', 'two'],
  relations: {
    foo: {
      type: 'HasOne',
      relatedModel: Foo,
      ownerCol: 'foo_id',
      relatedCol: 'id',
    }
  },
});

var models = {
  Foo: Foo,
  Bar: Bar,
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

      expect(func).to.not.throwException();

      return doneTest();
    });

    it('Should instantiate with no errors when not provided optional params', function (doneTest) {
      var func = function () {
        var wrapper = new ModelsWrapper({
          knex: knex,
          models: models,
        });
      };

      expect(func).to.not.throwException();

      return doneTest();
    });

    it('Should throw when not provided initProps.models', function (doneTest) {
      var func = function () {
        var wrapper = new ModelsWrapper({
          knex: knex,
        });
      };

      expect(func).to.throwException();

      return doneTest();
    });

    it('Should throw when not provided initProps.knex', function (doneTest) {
      var func = function () {
        var wrapper = new ModelsWrapper({
          models: models,
        });
      };

      expect(func).to.throwException();

      return doneTest();
    });

    it('Should have the correct properties when instantiated', function (doneTest) {
      var wrapper = new ModelsWrapper({
        knex: knex,
        models: models,
        customProps: {
          foo: 'yes',
        },
        presenters: {
          bar: 'yes',
        },
      });

      expect(wrapper._knex).to.exist;
      expect(wrapper._models).to.exist;
      expect(wrapper._customProps).to.eql({ foo: 'yes' });
      expect(wrapper.presenters).to.eql({ bar: 'yes' });

      return doneTest();
    });

    it('Should have the correct properties when instantiated with no optional props', function (doneTest) {
      var wrapper = new ModelsWrapper({
        knex: knex,
        models: models,
      });

      expect(wrapper._knex).to.exist;
      expect(wrapper._models).to.exist;
      expect(wrapper._customProps).to.be.empty();
      expect(wrapper.presenters).to.be.empty();

      return doneTest();
    });

  });

  describe('#query', function () {

    var wrapper = new ModelsWrapper({
      knex: knex,
      models: models,
    });

    it('Should return valid QueryBuilder', function (doneTest) {
      var func = function () {
        var builder = wrapper.query('Foo');

        builder.where('id', 1);
      };

      expect(func).to.not.throwException();

      return doneTest();
    });

    it('Should reject if model does not exist', function (doneTest) {
      var func = function () {
        return wrapper.query('Unexistent');
      };

      func()
        .then(function () {
          expect().fail('should have rejected');
        })
        .catch(function (err) {
          return doneTest();
        });
    });

  });

  describe('#create', function () {

    // clean env for each test
    beforeEach(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return done();
        })
        .catch(done);
    });

    // clean it all up
    after(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return done();
        })
        .catch(done);
    });

    var wrapper = new ModelsWrapper({
      knex: knex,
      models: models,
    });

    it('Should reject if model does not exist', function (doneTest) {
      var func = function () {
        return wrapper.create('Unexistent');
      };

      func()
        .then(function () {
          expect().fail('should have rejected');
        })
        .catch(function (err) {
          return doneTest();
        });
    });

    it('Expect throw if body argument is not passed in', function (doneTest) {
      var func = function () {
        wrapper.create('Foo');
      };

      expect(func).to.throwException();

      return doneTest();
    });

    it('Should create record with no errors', function (doneTest) {
      wrapper.create('Foo', { one: 'yes' })
        .then(function (model) {
          expect(model).to.have.property('id');

          return doneTest();
        })
        .catch(doneTest);
    });

  });

  describe('#update', function () {

    // clean env for each test
    beforeEach(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return knex('foo')
            .insert({ one: '1', two: '2' });
        })
        .then(function () {
          return done();
        })
        .catch(done);
    });

    // clean it all up
    after(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return done();
        })
        .catch(done);
    });

    var wrapper = new ModelsWrapper({
      knex: knex,
      models: models,
    });

    it('Expect reject if body argument is not passed in', function (doneTest) {
      wrapper.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          var model = new models.Foo({ id: result[0].id });

          return wrapper.update(result[0]);
        })
        .then(function () {
          expect().fail('should have rejected');
        })
        .catch(function (err) {
          return doneTest();
        });
    });

    it('Should return model after updating properly', function (doneTest) {
      var id;

      wrapper.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          var model = new models.Foo({ id: result[0].id });

          id = result[0].id;

          return wrapper.update(result[0], { one: '1*1=2' });
        })
        .then(function (model) {
          expect(model.id).to.equal(id);
          expect(model.one).to.equal('1*1=2');
          expect(model.two).to.equal('2');

          return doneTest();
        })
        .catch(doneTest);
    });

    it('Should update model even if not full model', function (doneTest) {
      var id;

      wrapper.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          id = result[0].id;

          var model = new models.Foo({ id: result[0].id });

          return wrapper.update(model, { one: '1*1=2' });
        })
        .then(function (model) {
          expect(model.id).to.equal(id);
          expect(model.one).to.equal('1*1=2');
          expect(model.two).to.be(undefined);

          return doneTest();
        })
        .catch(doneTest);
    });

  });

  describe('#destroy', function () {

    // clean env for each test
    beforeEach(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return knex('foo')
            .insert({ one: '1', two: '2' });
        })
        .then(function () {
          return done();
        })
        .catch(done);
    });

    // clean it all up
    after(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return done();
        })
        .catch(done);
    });

    var wrapper = new ModelsWrapper({
      knex: knex,
      models: models,
    });

    it('Should return model after destroying properly', function (doneTest) {
      wrapper.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          return wrapper.destroy(result[0]);
        })
        .then(function (model) {
          expect(model.id).to.be(null);
          expect(model.one).to.equal('1');
          expect(model.two).to.equal('2');

          return doneTest();
        })
        .catch(doneTest);
    });

    it('Should destroy model even if not full model', function (doneTest) {
      wrapper.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          var model = new models.Foo({ id: result[0].id });

          return wrapper.destroy(model);
        })
        .then(function (model) {
          expect(model.id).to.be(null);
          expect(model.one).to.be(undefined);
          expect(model.two).to.be(undefined);

          return doneTest();
        })
        .catch(doneTest);
    });

  });

  describe('Relations', function () {

    // clean env for each test
    beforeEach(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return knex('foo')
            .insert({ one: '1', two: '2' });
        })
        .then(function () {
          return knex('foo')
            .select('id');
        })
        .then(function (result) {
          return knex('bar')
            .insert({ foo_id: result[0].id, two: '2' });
        })
        .then(function () {
          return done();
        })
        .catch(done);
    });

    // clean it all up
    after(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return done();
        })
        .catch(done);
    });

    var wrapper = new ModelsWrapper({
      knex: knex,
      models: models,
    });

    it('Should return the correct record', function (doneTest) {
      wrapper.query('Bar')
        .include('foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          var bar = result[0];

          expect(bar.foo).to.be.an('object');
          expect(bar.foo.id).to.equal(bar.fooId);

          return doneTest();
        })
        .catch(doneTest);
    });

  });

});
