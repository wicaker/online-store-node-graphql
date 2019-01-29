const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql"); // graphql midleware function

const isAuth = require('./middleware/is-auth');

// import graphql router
const graphQlResolver = require('./graphql/resolver/index');
const graphQlSchema = require('./graphql/schema/index');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Avoid Access-Control-Allow-Origin Error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //this allow all client with everything domain to access our api
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});

//call midleware(automatically check incoming req authorization) 
app.use(isAuth);

// Connet to graphql endpoint
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true //choose true to allow access graphql testing in browser
  })
);


//Connect to database mongodb trough mongoose
mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@ds213755.mlab.com:13755/${process.env.MONGO_DB}`,
    { useNewUrlParser: true }
  )
  .then(() =>
    app.listen(port, () => console.log(`App listening on port ${port}!`))
  )
  .catch(err => console.log(err));