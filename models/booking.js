const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    amount: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
