const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql"); // graphql midleware function
const cloudinary = require("cloudinary");
const formData = require("express-form-data");
const path = require('path')
const port = process.env.PORT || 5000;

const isAuth = require("./middleware/is-auth");

require("dotenv").config();

// import graphql router
const graphQlResolver = require("./graphql/resolver/index");
const graphQlSchema = require("./graphql/schema/index");

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
  if (req.method === "OPTIONS") {
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

// upload images endpoint
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(formData.parse());
app.post("/image-upload", (req, res) => {
  const values = Object.values(req.files);
  const promises = values.map(image => cloudinary.uploader.upload(image.path));
  Promise.all(promises).then(results => res.json(results));
});

// serve static front end
app.use('/', express.static(path.join(__dirname, 'build')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'));
});


//Connect to database mongodb trough mongoose
mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@ds033601.mlab.com:33601/${process.env.MONGO_DB}`,
    { useNewUrlParser: true }
  )
  .then(() =>
    app.listen(port, () => console.log(`App listening on port ${port}!`))
  )
  .catch(err => console.log(err));
