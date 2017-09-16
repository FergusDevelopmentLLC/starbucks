
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');

const Model = require('objection').Model;
const Knex = require('knex');
const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const app = express();

app.use(express.static(__dirname + "/public")); //allows serving of static files in public folder
app.use(express.static(__dirname + "/node_modules")); //allows serving of installed npm modules to front end

// middleware
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());

//routes
//starbucks map
const grid = require('./routes/grid');
app.use('/grid', grid);

const starbucksdata = require('./routes/starbucks');
app.use('/starbucks_data', starbucksdata);

//popular_name map
const popular_name = require('./routes/popular_name');
app.use('/popular_name', popular_name);

const state = require('./routes/state');
app.use('/state', state);

// catch 404 and forward them to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler function
app.use((req, res, next) => {

  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;

  //respond to the client
  res.status(status).json({
    error: {
      message: error.message
    }
  });

  //respond to console
  console.error(err);
});

// Start the server
const server = app.listen(8644, () => {
  console.log('App listening at port %s', server.address().port);
});
