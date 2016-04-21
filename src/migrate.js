var Knex = require('knex');

function run (command) {
  return new Promise(function (resolve) {
    console.log(command);
    var knex = Knex({
      client: 'pg',
      connection: process.env.POSTGRESQL_CONNECTION_STRING || 'postgres://postgres:postgres@localhost:5432/lars',
      migrations: {
        directory: './src/migrations'
      },
    });
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

run(process.argv[2]).then(function () {
  process.exit(0);
}).catch (function (err) {
  console.log('Error', err);
  process.exit(1);
});
