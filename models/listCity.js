const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listCitySchema = new Schema(
  {
    city_id: Number,
    province_id: Number,
    province: String,
    type: String,
    city_name: String,
    postal_code: Number,
    jne_price_jogja: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("List_City", listCitySchema);
