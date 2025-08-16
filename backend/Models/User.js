const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ALLOWED_ROLES = ["Admin", "Exhibitor", "Attendee"];

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 60
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ALLOWED_ROLES,
    default: "Attendee",
    required: true
  }
}, { timestamps: true });

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
module.exports.ALLOWED_ROLES = ALLOWED_ROLES;
