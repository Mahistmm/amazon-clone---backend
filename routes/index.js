const router = require("express").Router();

const userrouter = require("./user");
const checkoutrouter = require("./checkout");

router.use("/user", userrouter);
router.use("/checkout", checkoutrouter);

module.exports = router;
