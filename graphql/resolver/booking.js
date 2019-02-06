const Product = require("../../models/product");
const Booking = require("../../models/booking");

module.exports = {
  // @mutation bookingItem(productId: ID!): Booking!
  // @desc create booking item (not ready to purchase)
  // @access Private, customer
  bookingItem: (args, req) => {
    if (!req.isAuth || req.userId.status !== "customer") {
      throw new Error("Unauthenticated");
    }
    const newBooking = new Booking({
      user: req.userId.userId,
      product: args.bookingInput.product,
      amount: args.bookingInput.amount
    });
    return newBooking
      .save()
      .then(result => {
        Product.findOne({ _id: result.product }).then(productId => {
          let updateStock = parseInt(productId.stock) - result.amount;
          productId.set({ stock: updateStock });
          productId.save();
        });
        return result;
      })
      .catch(err => console.log(err));
  },

  // @mutation cancleBooking(id: String!): Booking
  // @desc delete booking field (cancle booking)
  // @access Private, customer
  cancleBooking: (args, req) => {
    if (!req.isAuth || req.userId.status !== "customer") {
      throw new Error("Unauthenticated");
    }
    Booking.find({ _id: args.bookingId })
      .then(result => {
        Product.findOne({ _id: result[0].product }).then(resultProduct => {
          const updateStock =
            parseInt(resultProduct.stock) + parseInt(result[0].amount);
          resultProduct.set({ stock: updateStock });
          resultProduct.save();
        });
      })
      .then(() => Booking.deleteOne({ _id: args.bookingId }));
  },

  // @query bookings:[Booking!]!
  // @desc looking for booking was created last
  // @access Private, customer
  bookings: async ({ userId }, req) => {
    if (!req.isAuth || req.userId.status !== "customer") {
      throw new Error("Unauthenticated");
    }
    const listBooking = await Booking.find({ user: userId });
    return listBooking;
  }
};
