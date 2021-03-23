const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Flight = mongoose.model(
  "flight",
  new mongoose.Schema({
    name: {
      type: String,
      require: true,
    },
    target: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    namber: {
      type: Number,
      require: true,
    },
  })
);

module.exports.flightValidation = (fields, isAdd = false) => {
  console.log(fields);

  const obj = {
    name: joi.string(),
    target: joi.string(),
    date: joi.date(),
    namber: joi.number().min(1000),
  };
  if (isAdd) {
    for (let field in obj) {
      obj[field] = obj[field].required();
    }
  }

  let { error } = joi.object(obj).validate(fields, { abortEarly: false });

  return (
    error &&
    error.details.reduce((str, { message }) => `${str}\n${message}`, "")
  );
};
