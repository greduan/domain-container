'use strict';

var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'models-wrapper-test',
  },
});

knex.schema
  .createTable('foo', function (t) {
    t.increments();
    t.string('one');
    t.string('two');
  })
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
