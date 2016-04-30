var cryptex = require('cryptex');
var Knex = require('knex');
var knex;

function configuring () {
  return cryptex.getSecret('postgresql_connection_string').then(function (postgresql_connection_string) {
    knex = Knex({
      client: 'pg',
      connection: postgresql_connection_string,
      migrations: {
        directory: './src/migrations'
      }
    });
  });
}

function running (command) {
  return new Promise(function (resolve) {
    console.log(command);
    switch (command) {
      case 'status':
        knex.migrate.currentVersion().then(function (result) {
          console.log('Current version of database is', result);
          resolve();
        }).catch(function (err) {
          console.log('Error', err);
        });
        break;
      case 'latest':
        knex.migrate.latest().then(function (result) {
          console.log('Database migrated to latest version');
          resolve();
        }).catch(function (err) {
          console.log('Error', err);
        });
        break;
    }
  });
}

configuring().then(function () {
  return running(process.argv[2]);
}).then(function () {
  process.exit(0);
}).catch (function (err) {
  console.log('Error', err);
  process.exit(1);
});
