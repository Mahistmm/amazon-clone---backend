const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const verifytoken = require("../middlewares/verifyToken");

router.get("/", (req, res) => {
  res.send("user router is working ");
});

router.post("/signup", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const passwordhash = await bcrypt.hash(req.body.password, salt);
  const user = await User.create({
    email: req.body.email,
    password: passwordhash,
  });
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mahistmm@gmail.com",
      pass: "iymiwhbvfkixxvqw",
    },
  });
  let info = await transporter.sendMail({
    from: "Amazon Team <mahistmm@gmail.com>",
    to: req.body.email,
    subject: "Verify your email - Amazon",
    html: `<div>
    <strong>${req.body.email}</strong>, We Welcome to our Amazon platform.
    <a style="background-color: yellow;color: black;" href="http://localhost:3000/user/verify/${token}">Verify Email</a>
    <div>
    <h3>Thanks and Regards </h3>
    <h5>For Amazon Team </h5>
    </div>
    </div>
    `,
  });
  if (info) {
    console.log(info);
  }
  res.send("Account created , Please verify your email");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  const result = await User.findOne({ email: email });

  if (result) {
    if (result.verified) {
      bcrypt.compare(password, result.password).then((passwordResult) => {
        if (passwordResult) {
          jwt.sign(
            { userId: result._id },
            process.env.SECRET_KEY,
            (err, token) => {
              if (err) {
                console.log(err);
              } else {
                return res.json({
                  success: true,
                  msg: "Login successful",
                  token,
                });
              }
            }
          );
        } else {
          return res.json({ success: false, msg: "Incorret password" });
        }
      });
    } else {
      return res.json({ success: false, msg: "Please verify your email" });
    }
  } else {
    return res.json({ success: false, msg: "user is not registered" });
  }
});

router.get("/data", verifytoken, (req, res) => {
  res.json(req.user);
});

router.get("/verify/:token", (req, res) => {
  jwt.verify(req.params.token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.json({ msg: "Link expired" });
    }
    const id = decoded.id;
    await User.findByIdAndUpdate(id, { verified: true });
    return res.json({ msg: "Account verified successfully", success: true });
  });
});

module.exports = router;
