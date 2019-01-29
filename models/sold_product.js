const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soldProductsSchema = new Schema ({
  
}, { timestamps: true })

module.exports = mongoose.model('Sold_Products', soldProductsSchema);