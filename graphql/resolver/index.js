const authResolver = require("./auth");
const bookingResolver = require("./booking");
const cityResolver = require("./city");
const productResolver = require("./product");
const soldResolver = require("./sold");

const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...cityResolver,
  ...productResolver,
  ...soldResolver
};

module.exports = rootResolver;
