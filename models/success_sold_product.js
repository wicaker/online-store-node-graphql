const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const successSoldProduct = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking"
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    amount: {
      type: Number,
      required: true
    },
    name_receiper: {
      type: String,
      required: true
    },
    tlp_number: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    expedition: {
      type: String
    },
    total: {
      type: Number,
      required: true
    },
    destination_city: {
      type: String
    },
    payment_method: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Success_Sold_Products", successSoldProduct);
