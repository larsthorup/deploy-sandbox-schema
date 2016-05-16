Postgresql deployment automation - sandbox
====

Prerequisite
----

* Ensure that you have a local PostgreSQL instance as specified in cryptex.json 


    npm install


Schema commands
----

    npm run migrate:status
    npm run migrate:latest
    npm run migrate:drop
    npm run migrate:create
    npm run migrate:recreate