var path = require('path');
var cryptex = require('cryptex');
var Knex = require('knex');

var cnxString;

var knex = (function () {
  var instance;
  return function () {
    if (!instance) {
      instance = Knex({
        client: 'pg',
        connection: `${cnxString}/${dbName}`,
        migrations: {
          directory: path.join(__dirname, './migrations')
        }
      });
    }
    return instance;
  }
})();

var knexAdmin = (function () {
  var instance;
  return function () {
    if (!instance) {
      instance = Knex({
        client: 'pg',
        connection: `${cnxString}/postgres`,
        // debug: true
      });
    }
    return instance;
  }
})();

var dbName = 'lars';

function configuring () {
  return cryptex.getSecret('postgresql_connection_string').then(function (postgresql_connection_string) {
    cnxString = postgresql_connection_string;
  });
}

function drop () {
  return knexAdmin().raw(`drop database ${dbName};`).then(function () {
    console.log(`Database ${dbName} dropped`);
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function create () {
  return knexAdmin().raw(`create database ${dbName};`).then(function () {
    console.log(`Database ${dbName} created`);
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function status () {
  return knexAdmin()('pg_database').where({datname: dbName}).select(knexAdmin().raw('count(*) = 1 as exists')).then(function (rows) {
    var exists = rows[0].exists;
    if (exists) {
      return knex().migrate.currentVersion();
    } else {
      return 'non-existing';
    }
  }).then(function (result) {
    console.log('Current version of database is', result);
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function latest () {
  return knex().migrate.latest().then(function (result) {
    console.log('Database migrated to latest version');
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function running (command) {
  console.log(command);
  switch (command) {
    case 'drop':
      return drop();
    case 'create':
      return create();
    case 'status':
      return status();
    case 'latest':
      return latest();
  }
}

configuring().then(function () {
  return running(process.argv[2]);
}).then(function () {
  process.exit(0);
}).catch (function (err) {
  console.log('Error', err);
  process.exit(1);
});
