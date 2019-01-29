const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
