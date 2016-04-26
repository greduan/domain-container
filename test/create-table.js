'use strict';

var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'domain-container-test',
  },
});

knex.schema
  .createTable('foo', function (t) {
    t.increments();
    t.string('one');
    t.string('two');
  })
  .createTable('bar', function (t) {
    t.increments();
    t.integer('foo_id')
      .notNullable()
      .references('id')
      .inTable('foo')
      .onDelete('CASCADE');
    t.string('two');
  })
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
