const express = require("express");
const parser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 8000;
const db = require("./db/config");
const model = require("./db");
const router = require("./router");
// middleware
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(express.static(path.join(__dirname, "../static")));

app.use("/api", router);
// have express instance listen in on a PORT
app.listen(PORT, err => {
  if (err) {
    console.log("there was an error in the server! ", err);
  } else {
    console.log("Successfully connected to the server", PORT);
  }
});
