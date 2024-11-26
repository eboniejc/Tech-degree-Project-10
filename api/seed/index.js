'use strict';

const promiseFinally = require('promise.prototype.finally');
const Database = require('./database');
const data = require('./data.json');

const enableLogging = process.env.DB_ENABLE_LOGGING === 'true';
const database = new Database(data, enableLogging);

promiseFinally.shim();

//switch
// database.init()
//   .catch(err => console.error(err))
//   .finally(() => process.exit());

//delete
  database
  .init()
  .then(() => {
    console.log("Database initialized and seeded successfully!");
  })
  .catch(err => {
    console.error("Error initializing the database:", err);
  })
  .finally(() => {
    process.exit();
  });