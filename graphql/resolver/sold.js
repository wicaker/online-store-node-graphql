const https = require("https");
const qs = require("querystring");
const Product = require("../../models/product");
const Booking = require("../../models/booking");
const Pending_Sold = require("../../models/pending_sold_product");
const Success_Sold = require("../../models/success_sold_product");
const emailResponse = require("../../email_response");
const Payment_Received = require("../../models/payment_received");
const User = require("../../models/user");

module.exports = {
  // @mutation soldProduct(soldInput: SoldProductInput): Sold!
  // @desc Create pending sold product (ready to purchase), get expidition cost, send email to customer
  // @access Private, customer
  soldProduct: async (args, req) => {
    if (!req.isAuth || req.userId.status !== "customer") {
      throw new Error("Unauthenticated");
    }
    const bookingDetails = await Booking.findOne({
      _id: args.soldInput.bookingId
    });
    if (!bookingDetails) {
      throw new Error("Product has been purchased");
    } else {
      const productDetails = await Product.findOne({
        _id: bookingDetails.product
      });
      const buyer = req.userId.userId;
      const productPrice = parseInt(productDetails.price);
      const courier = await args.soldInput.expedition.split("-");
      const data = qs.stringify({
        origin: "501",
        destination: args.soldInput.destination_city, //dynamic
        weight: parseInt(productDetails.weight), //dynamic
        courier: courier[parseInt(courier[1])] //dynamic
      });
      const options = {
        method: "POST",
        hostname: "api.rajaongkir.com",
        port: null,
        path: "/starter/cost",
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
          "content-type": "application/x-www-form-urlencoded",
          "Content-Length": data.length
        }
      };
      const emailReceiper = req.userId.email;
      var req = https.request(options, function(res) {
        var chunks = [];
        res.on("data", function(chunk) {
          chunks.push(chunk);
        });
        res.on("end", function() {
          var body = Buffer.concat(chunks);
          const obj = JSON.parse(body);
          const totalPrice =
            obj.rajaongkir.results[0].costs[parseInt(courier[1])].cost[0]
              .value /
              13000 +
            productPrice;
          // Math.floor(Math.random() * 1000);
          const soldProduct = new Pending_Sold({
            bookingId: args.soldInput.bookingId,
            product: bookingDetails.product,
            buyer: buyer,
            amount: bookingDetails.amount,
            name_receiper: args.soldInput.name_receiper,
            tlp_number: args.soldInput.tlp_number,
            address: args.soldInput.address,
            expedition: args.soldInput.expedition,
            total: totalPrice.toFixed(2),
            destination_city: args.soldInput.destination_city,
            payment_method: args.soldInput.payment_method
          });
          soldProduct.save();
          bookingDetails.remove();

          //send email to member
          emailResponse.sendMail(
            emailReceiper,
            "Pending Purchasing",
            "Plase Finish your Sold Product",
            args.soldInput.name_receiper,
            totalPrice
          );
        });
      });
      req.write(data);
      req.end();
      return bookingDetails;
    }
  },

  // @query solds: [Sold!]!
  // @desc get all pending sold
  // @access Private, customer
  solds: async (args, req) => {
    if (!req.isAuth || req.userId.status !== "customer") {
      throw new Error("Unauthenticated");
    }
    const soldsDetail = await Pending_Sold.find({ buyer: req.userId.userId });
    return soldsDetail;
  },

  // @query soldsAll: [Sold!]!
  // @desc get all pending sold
  // @access Private, administrator
  soldsAll: (args, req) => {
    if (!req.isAuth || req.userId.status !== "administrator") {
      throw new Error("Unauthenticated");
    }
    return Pending_Sold.find()
      .then(soldItem => {
        return soldItem;
      })
      .catch(err => {
        throw err;
      });
  },

  // @mutation mutation successSoldProduct(soldId: String!): Sold! (success by administrator)
  // @desc update to success, create new success_sold field and delete pending_sold field
  // @access Private, administrator
  successSoldProduct: async (args, req, next) => {
    if (!req.isAuth || req.userId.status !== "administrator") {
      throw new Error("Unauthenticated");
    }
    const soldProduct = await Pending_Sold.find({ _id: args.soldId });
    const seller = await Product.findById(soldProduct[0].product);
    const successSoldProduct = new Success_Sold({
      product: soldProduct[0].product,
      bookingId: soldProduct[0].bookingId,
      buyer: soldProduct[0].buyer,
      amount: soldProduct[0].amount,
      name_receiper: soldProduct[0].name_receiper,
      tlp_number: soldProduct[0].tlp_number,
      address: soldProduct[0].address,
      expedition: soldProduct[0].expedition,
      total: soldProduct[0].total,
      destination_city: soldProduct[0].destination_city,
      payment_method: soldProduct[0].payment_method,
      seller: seller.seller
    });
    successSoldProduct.save();
     //send email to member
     emailResponse.sendMail(
      req.userId.email,
      "Success Purchasing",
      "Congratulation !!!",
      req.userId.email,
      "success"
    );
    //update payment from pending to success
    const paymentStatus = await Payment_Received.findOneAndUpdate(
      { pendingId: args.soldId },
      { status: true }
    );
    soldProduct[0].remove();
    return successSoldProduct;
  },

  // @mutation cancleSoldProduct(soldId: String!): Sold!
  // @desc delete (cancel) pending sold product
  // @access Private, customer
  cancleSoldProduct: async args => {
    const soldProduct = await Pending_Sold.find({ _id: args.soldId });
    if (soldProduct[0].status === "success") {
      throw new Error("Product has been successfully purchased");
    }
    const amountSoldProduct = soldProduct[0].amount;
    const listProduct = await Product.findOne({ _id: soldProduct[0].product });
    let stockProduct = listProduct.stock;
    stockProduct = parseInt(stockProduct) + parseInt(amountSoldProduct);
    listProduct.set({ stock: stockProduct });
    listProduct.save();
    soldProduct[0].remove();
    return soldProduct[0];
  },

  // @query successSoldProducts: [Sold!]!
  // @desc get data success sold products
  // @access Private
  successSoldProducts: (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req.userId.status === "administrator") {
      return Success_Sold.find({ seller: req.userId.userId })
        .then(soldItem => {
          return soldItem;
        })
        .catch(err => {
          throw err;
        });
    } else if (req.userId.status === "customer") {
      return Success_Sold.find({ buyer: req.userId.userId })
        .then(soldItem => {
          return soldItem;
        })
        .catch(err => {
          throw err;
        });
    }
  },

  // @mutation receivePaypalPayment(dataInput: String!): PaypalPayment
  // @desc get data success payment trough paypal
  // @access Private, customer
  receivePaypalPayment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    const userSender = await User.findById(req.userId.userId);
    let success = false;
    if (args.dataInput.email === userSender.email) {
      success = true;
      const soldProduct = await Pending_Sold.findById(args.pendingID);
      const seller = await Product.findById(soldProduct.product);
      const successSoldProduct = new Success_Sold({
        product: soldProduct.product,
        bookingId: soldProduct.bookingId,
        buyer: soldProduct.buyer,
        amount: soldProduct.amount,
        name_receiper: soldProduct.name_receiper,
        tlp_number: soldProduct.tlp_number,
        address: soldProduct.address,
        expedition: soldProduct.expedition,
        total: soldProduct.total,
        destination_city: soldProduct.destination_city,
        payment_method: soldProduct.payment_method,
        seller: seller.seller
      });
      emailResponse.sendMail(
        req.userId.email,
        "Success Purchasing",
        "Congratulation !!!",
        req.userId.email,
        "success"
      );
      successSoldProduct.save();
      soldProduct.remove();
    }
    const newPaypalPayment = new Payment_Received({
      pendingId: args.pendingID,
      email: args.dataInput.email,
      payer_id: args.dataInput.payerID,
      payment_id: args.dataInput.paymentID,
      payment_token: args.dataInput.paymentToken,
      status: success
    });
    return newPaypalPayment.save();
  },

  // @query showReceivedPaypalPayment: PaypalPayment!
  // @desc get all received paypal payment with status 'false'
  // @access Private, administrator
  showReceivedPaypalPayment: async (args, req) => {
    if (!req.isAuth || req.userId.status !== "administrator") {
      throw new Error("Unauthenticated");
    }
    const allPaypalPayment = await Payment_Received.find({ status: "false" });
    return allPaypalPayment;
  }
};
