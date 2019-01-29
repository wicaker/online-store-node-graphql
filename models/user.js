const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      //status to save the user is administrator or customer
      type: String,
      required: true
    },
    sellingProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    buyingProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ]
  },
  { timestamps: true } //mongoose automaticaly add createdAt and updatedAt
);

module.exports = mongoose.model("User", userSchema);
