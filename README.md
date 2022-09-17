1.  Steps to run this file
        1. Unzip file
        2. Use 16.16 node version
        3. npm I
        4. Put all db credentials and other details in .env file
        5. Put db credentials in “development” in config.json file in config folder for migration uses
        6. Run server by “node server”
2.  I added following scripts in package.json file  
    "scripts": {
        "start": "node server.js",
        "make-migration": "./node_modules/sequelize-auto-migrations/bin/makemigration.js",
        "migrate": "npx sequelize db:migrate",
        "make-seeder": "npx sequelizse-cli seed:generate --name",
        "seed-data": "npx sequelize-cli db:seed:all",
        "cypress:open": "cypress open",
        "inittest": "start-server-and-test start http://localhost:3008/  cypress:open"
    },

    Note:
        sequelize-cli : this module create 3 new folders like models, migration and seeder
    make-migration : this is used for create migrationmigrate : this is used to run migration
    make-seeder : this is used for create seeder, in this you need to pass table name like “npm run make-seeder User”
    seed-data : this is used to run seeder
    Note:
         cypress module is used for e2e testing, in this I created a user.cy.js file and wrote all test cases
    inittest : this just runs the server and opens cypress, from where we can run test cases
3.  I created “apiDocumentation.json” .This file has documentation of all APIs
4.  I used the "log4js" module to write logs in a file, file name is “cheese.log”
5.  I used "mysql" database and "hapi" framework