const route = require("express").Router();

route.get("/", (req, res) => {
  console.log(req.cookies);
  res.render("index.ejs");
});

module.exports = route;
