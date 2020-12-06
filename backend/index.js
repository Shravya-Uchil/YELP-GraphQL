// import the require dependencies
// import express module
var express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
// create express app
var app = express();
// express middleware body parser
var bodyParser = require('body-parser');
// express session
var session = require('express-session');
// cookie parser
var cookieParser = require('cookie-parser');
// Cross-origin resource sharing
var cors = require('cors');
const { frontendURI, secret, mongoDBURI } = require('./config/config');
const mongoose = require('mongoose');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: frontendURI, credentials: true }));

app.use(bodyParser.json());
app.use(cookieParser());

//use express session to maintain session data
app.use(
  session({
    secret: secret,
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  })
);

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', frontendURI);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//connect to mongoDB
const connectMongoDB = async () => {
  const options = {
    poolSize: 1,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  try {
    await mongoose.connect(mongoDBURI, options);
    console.log('MongoDB connected');
  } catch (err) {
    console.log('Could not connect to MongoDB', err);
  }
};
connectMongoDB();

app.use(
  '/graphiql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3001, () => {
  console.log('GraphQL server started on port 3001');
});
console.log('server is up and listening on port 3001');

module.exports = app;
