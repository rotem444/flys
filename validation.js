const _ = require("lodash");
const joi = require("joi");

const schemas = {
  signup: joi.object({
    name: joi
      .string()
      .min(2)
      .max(16)
      .trim()
      .lowercase()
      .required()
      .label("Name"),
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  }),
  signin: joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  }),
  putfly: joi.object({
    target: joi.string().min(2).max(16).required().label("Target"),
    date: joi.date().required().label("Date"),
    namber: joi.number().min(1000).max(9999).required().label("Namber"),
  }),
  getfly: joi.object({
    name: joi.string().min(2).max(16).trim().lowercase().label("Name"),
    target: joi.string().min(2).max(16).label("Target"),
    date: joi.date().label("Date"),
    namber: joi.number().min(1000).max(9999).label("Namber"),
  }),
};

module.exports = (req, res, next) => {
  let url = req.originalUrl.slice(1);
  for (let key in schemas) {
    if (url.startsWith(key)) {
      let { error } = schemas[key].validate(req.body, { abortEarly: false });
      return error
        ? res
            .status(404)
            .send(
              error.details.reduce(
                (str, { message }) => `${str}\n${message}`,
                ""
              )
            )
        : next();
    }
  }
  res.status(404).send("invalid paht");
};
