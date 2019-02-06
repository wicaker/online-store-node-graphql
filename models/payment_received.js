const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentReceived = new Schema(
  {
    pendingId: {
      type: Schema.Types.ObjectId,
      ref: "Pending_Sold_Products"
    },
    email: {
      type: String,
      required: true
    },
    payer_id: {
      type: String,
      required: true
    },
    payment_id: {
      type: String,
      required: true
    },
    payment_token: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment_Received", paymentReceived);
