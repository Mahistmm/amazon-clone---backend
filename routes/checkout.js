const router = require("express").Router();
const { v4: uuid } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { Checkout } = require("../models/Index");
const getuser = require("../middlewares/getUser");

router.get("/", (req, res) => {
  res.send("checkout router is working ");
});

router.post("/create-payment", getuser, async (req, res) => {
  const { total, items } = req.body;

  const orderid = uuid();

  const paymentintent = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "inr",
    metadata: {
      order_id: orderid,
    },
  });
  await Checkout.create({
    items,
    total,
    order_id: orderid,
    payment_id: paymentintent.id,
    user: req.userId,
  });
  res.json({ clientSecret: paymentintent.client_secret });
});

router.get("/orders", getuser, async (req, res) => {
  const orders = await Checkout.find({ user: req.userId }).populate(
    "user",
    "-password"
  );
  res.json(orders);
});
module.exports = router;
