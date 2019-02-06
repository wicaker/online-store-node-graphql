const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    specification: {
      type: String,
      required: true
    },
    variation: {
      type: String,
      required: true
    },
    tags: String,
    category: {
      type: String,
      required: true
    },
    stock: {
      type: String,
      required: true
    },
    picture: {
      // data: Buffer,
      // contentType: String
      type: String
    },
    discount: String,
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    buyer: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
