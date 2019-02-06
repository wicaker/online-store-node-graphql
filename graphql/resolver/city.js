const City = require("../../models/listCity");

module.exports = {
  // @query citys: [City!]!
  // @desc get all citys data
  // @access Private, customer
  citys: () => {
    return City.find()
      .then(citys => {
        return citys;
      })
      .catch(err => {
        throw err;
      });
  }
};
