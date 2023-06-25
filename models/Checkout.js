const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema(
  {
    items: [
      new mongoose.Schema({
        image: String,
        price: Number,
        rating: Number,
        title: String,
      }),
    ],
    total: Number,
    payment_id: String,
    order_id: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const Checkout = mongoose.model("checkout", checkoutSchema);

module.exports = Checkout;
