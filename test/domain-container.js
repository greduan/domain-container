'use strict';

var expect = require('expect.js');

var DomainContainer = require('./..');

require('krypton-orm');

var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'domain-container-test',
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

describe('DomainContainer', function () {

  describe('Instantiation', function () {

    it('Should instantiate with no errors', function (doneTest) {
      var func = function () {
        var container = new DomainContainer({
          knex: knex,
          models: models,
          modelExtras: {},
          presenters: {},
        });
      };

      expect(func).to.not.throwException();

      return doneTest();
    });

    it('Should instantiate with no errors when not provided optional params', function (doneTest) {
      var func = function () {
        var container = new DomainContainer({
          knex: knex,
          models: models,
        });
      };

      expect(func).to.not.throwException();

      return doneTest();
    });

    it('Should throw when not provided initProps.models', function (doneTest) {
      var func = function () {
        var container = new DomainContainer({
          knex: knex,
        });
      };

      expect(func).to.throwException();

      return doneTest();
    });

    it('Should throw when not provided initProps.knex', function (doneTest) {
      var func = function () {
        var container = new DomainContainer({
          models: models,
        });
      };

      expect(func).to.throwException();

      return doneTest();
    });

    it('Should have the correct properties when instantiated', function (doneTest) {
      var container = new DomainContainer({
        knex: knex,
        models: models,
        modelExtras: {
          foo: 'yes',
        },
        presenters: {
          bar: 'yes',
        },
        props: {
          man: 'yes',
        },
      });

      expect(container).to.have.property('_knex');
      expect(container).to.have.property('_models');

      expect(container).to.have.property('_modelExtras');
      expect(container._modelExtras).to.eql({ foo: 'yes' });

      expect(container).to.have.property('props');
      expect(container.props).to.eql({ man: 'yes' });

      expect(container).to.have.property('presenters');
      expect(container.presenters).to.eql({ bar: 'yes' });

      return doneTest();
    });

    it('Should have the correct properties when instantiated with no optional props', function (doneTest) {
      var container = new DomainContainer({
        knex: knex,
        models: models,
      });

      expect(container).to.have.property('_knex');
      expect(container).to.have.property('_models');

      expect(container).to.have.property('_modelExtras');
      expect(container._modelExtras).to.be.empty();

      expect(container).to.have.property('props');
      expect(container.props).to.be.empty();

      expect(container).to.have.property('presenters');
      expect(container.presenters).to.be.empty();

      return doneTest();
    });

  });

  describe('#query', function () {

    var container = new DomainContainer({
      knex: knex,
      models: models,
    });

    it('Should return valid QueryBuilder', function (doneTest) {
      var func = function () {
        var builder = container.query('Foo');

        builder.where('id', 1);
      };

      expect(func).to.not.throwException();

      return doneTest();
    });

    it('Should reject if model does not exist', function (doneTest) {
      var func = function () {
        return container.query('Unexistent');
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

    var container = new DomainContainer({
      knex: knex,
      models: models,
    });

    it('Should reject if model does not exist', function (doneTest) {
      var func = function () {
        return container.create('Unexistent');
      };

      func()
        .then(function () {
          expect().fail('should have rejected');
        })
        .catch(function (err) {
          return doneTest();
        });
    });

    it('Should create record with no errors', function (doneTest) {
      container.create('Foo', { one: 'yes' })
        .then(function (model) {
          expect(model).to.have.property('id');

          return doneTest();
        })
        .catch(doneTest);
    });

    it('Should set ._modelExtras and ._container in created model', function (doneTest) {
      container.create('Foo', { one: 'yes' })
        .then(function (model) {
          expect(model).to.have.property('id');
          expect(model).to.have.property('_modelExtras');
          expect(model).to.have.property('_container');

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

    var container = new DomainContainer({
      knex: knex,
      models: models,
    });

    it('Should return model after updating properly', function (doneTest) {
      var id;

      container.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          var model = new models.Foo({ id: result[0].id });

          id = result[0].id;

          return container.update(result[0], { one: '1*1=2' });
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

      container.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          id = result[0].id;

          var model = new models.Foo({ id: result[0].id });

          return container.update(model, { one: '1*1=2' });
        })
        .then(function (model) {
          expect(model.id).to.equal(id);
          expect(model.one).to.equal('1*1=2');
          expect(model.two).to.be(undefined);

          return doneTest();
        })
        .catch(doneTest);
    });

    it('Should set ._modelExtras and ._container in updated model', function (doneTest) {
      var id;

      container.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          id = result[0].id;

          var model = new models.Foo({ id: result[0].id });

          return container.update(model, { one: '1*1=2' });
        })
        .then(function (model) {
          expect(model.id).to.equal(id);
          expect(model).to.have.property('_modelExtras');
          expect(model).to.have.property('_container');

          return doneTest();
        })
        .catch(doneTest);
    });

    it('Should just save model if not provided body parameter', function (doneTest) {
      var id;

      container.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          var model = new models.Foo({ id: result[0].id });

          id = result[0].id;
          result[0].one = '1*1=2';

          return container.update(result[0]);
        })
        .then(function (model) {
          expect(model.id).to.equal(id);
          expect(model.one).to.equal('1*1=2');
          expect(model.two).to.equal('2');

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

    var container = new DomainContainer({
      knex: knex,
      models: models,
    });

    it('Should return model after destroying properly', function (doneTest) {
      container.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          return container.destroy(result[0]);
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
      container.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          var model = new models.Foo({ id: result[0].id });

          return container.destroy(model);
        })
        .then(function (model) {
          expect(model.id).to.be(null);
          expect(model.one).to.be(undefined);
          expect(model.two).to.be(undefined);

          return doneTest();
        })
        .catch(doneTest);
    });

    it('Should set ._modelExtras and ._container in destroyed model', function (doneTest) {
      container.query('Foo')
        .then(function (result) {
          expect(result).to.have.length(1);

          return container.destroy(result[0]);
        })
        .then(function (model) {
          expect(model.id).to.be(null);
          expect(model).to.have.property('_modelExtras');
          expect(model).to.have.property('_container');

          return doneTest();
        })
        .catch(doneTest);
    });

  });

  describe('#get', function () {

    // clean it all up
    after(function (done) {
      knex('foo')
        .delete()
        .then(function () {
          return done();
        })
        .catch(done);
    });

    it('Should reject if model does not exist', function (doneTest) {
      var container = new DomainContainer({
        knex: knex,
        models: models,
      });

      var func = function () {
        return container.get('Unexistent');
      };

      func()
        .then(function () {
          expect().fail('should have rejected');
        })
        .catch(function (err) {
          return doneTest();
        });
    });

    it('Should return a model class with the correct properties', function (doneTest) {
      var container = new DomainContainer({
        knex: knex,
        models: models,
        modelExtras: {
          foo: 'yes',
        },
      });

      var Model = container.get('Foo');

      expect(Model.prototype).to.have.property('_modelExtras');
      expect(Model.prototype._modelExtras).to.eql({ foo: 'yes' });
      expect(Model.prototype).to.have.property('_container');
      expect(Model).to.have.property('_knex');

      return doneTest();
    });

    it('Should return a model that works', function (doneTest) {
      var container = new DomainContainer({
        knex: knex,
        models: models,
      });

      var Model = container.get('Foo');

      var model = new Model({
        one: 'ichi',
      });

      model.save()
        .then(function () {
          expect(model).to.have.property('id');
          expect(model).to.have.property('one');
          expect(model.one).to.equal('ichi');

          return doneTest();
        })
        .catch(doneTest);
    });

  });

  describe('#cleanup', function () {

    it('Should not throw when called', function (doneTest) {
      var knex = require('knex')({
        client: 'pg',
        connection: {
          database: 'domain-container-test',
        },
      });

      var container = new DomainContainer({
        knex: knex,
        models: models,
      });

      container.cleanup()
        .then(function () {
          return doneTest();
        })
        .catch(doneTest);
    });

    it('#query should not work after #cleanup', function (doneTest) {
      var knex = require('knex')({
        client: 'pg',
        connection: {
          database: 'domain-container-test',
        },
      });

      var container = new DomainContainer({
        knex: knex,
        models: models,
      });

      container.cleanup()
        .then(function () {
          return container.create('Foo', { one: '1' });
        })
        .then(function () {
          expect().fail('should have rejected');
        })
        .catch(function (err) {
          expect(err).to.match(/no pool/);

          return doneTest();
        });
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

    var container = new DomainContainer({
      knex: knex,
      models: models,
    });

    it('Should return the correct record', function (doneTest) {
      container.query('Bar')
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
