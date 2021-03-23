const router = require("express").Router();
const bcrypt = require("bcrypt");
const { Users } = require("../DB/Users");
const _ = require("lodash");
const joi = require("joi");
const valid = require("../valida");

const regSchem = {
  name: joi.string().min(2).max(16).trim().lowercase().required().label("Name"),
  email: joi.string().email().required().label("Email"),
  password: joi.string().required().label("Password"),
};

router.route("/up").post(async (req, res) => {
  console.log(req);
  res.send(3);
});

module.exports = router;
