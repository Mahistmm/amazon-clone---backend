const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/db");
const apirouter = require("./routes/index");
const cors = require("cors");

db();
app.use(cors());
app.use(express.json());

app.use("/api", apirouter);

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is up and running");
});
