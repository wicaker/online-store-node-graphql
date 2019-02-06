const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pendingSoldProduct = new Schema(
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
      type: String,
      required: true
    },
    payment_method: {
      type: String,
      required: true
    },
    expire_at: { type: Date, default: Date.now, expires: 7200 } ////expired in 2 hours (60*60*2)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pending_Sold_Products", pendingSoldProduct);
