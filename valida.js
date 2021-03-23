const joi = require("joi");

module.exports = (schema, fildes) => {
  let { error } = joi.object(schemas).validate(req.body, { abortEarly: false });
  console.log(error);
};
