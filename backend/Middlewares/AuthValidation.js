const Joi = require('joi');

const ALLOWED_ROLES = ["Admin/Organizer", "Exhibitor", "Attendee"];

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().valid(...ALLOWED_ROLES).default("Attendee")
  });

  const { error, value } = schema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.status(400).json({ message: "Bad Request", error });
  }
  req.body = value; // use sanitized body (includes default role if missing)
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad Request", error });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation
};
