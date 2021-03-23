const mongoose = require("mongoose");
const joi = require("joi");
const _ = require("lodash");

module.exports.Users = mongoose.model(
  "user",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    flights: {
      type: [
        {
          target: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            required: true,
          },
          namber: {
            type: Number,
            required: true,
          },
        },
      ],
      default: [],
    },
  })
);

const vlidator = (schema) => (fields, isAdding = false) => {
  schema = _.cloneDeep(schema);
  if (isAdding) {
    for (let filde in schema) {
      schema[filde] = schema[filde].required();
    }
  }

  let { error } = joi.object(schema).validate(fields, { abortEarly: false });

  return (
    error &&
    error.details.reduce((str, { message }) => `${str}\n${message}`, "")
  );
};

module.exports.flightValidation = vlidator({
  target: joi.string(),
  date: joi.date(),
  namber: joi.number().min(1000),
});

module.exports.validationUser = vlidator({
  name: joi.string().trim().lowercase().min(2).max(12).label("Name"),
  email: joi.string().email().label("email"),
  password: joi.string().min(6).max(30).label("Password"),
});

const validme = (fields, isRequired = true) => {
  let schema = {
    name: joi.string().trim().lowercase().min(2).max(12).label("Name"),
    email: joi.string().email().label("email"),
    password: joi.string().min(6).max(30).label("Password"),
    
  };
};
