const mongoose = require('mongoose');
const validator = require('validator');

const { isPassword } = require('./validate');
const { hashPassword } = require('./middleware');
const { comparePassword } = require('./methods');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [{ validator: value => validator.isEmail(value), msg: 'Invalid email.' },
               { validator: value => validator.isLength(value, { max: 128}), msg: 'Email is too long. Maximum 128 chars.'}],
  },

  password: {
    type: String,
    validate: [{ validator: isPassword, msg: 'Invalid password.' }],
    select: false
  },

  firstName: {
    type: String,
    required: true,
    validate: [{ validator: value => validator.isLength(value, { min: 2}), msg: 'First name is too short. Minimum 2 chars.'},
               { validator: value => validator.isLength(value, { max: 64}), msg: 'First name is too long. Maximum 64 chars.'}]
  },

  lastName: {
    type: String,
    required: true,
    validate: [{ validator: value => validator.isLength(value, { min: 2}), msg: 'Last name is too short. Minimum 2 chars.'},
               { validator: value => validator.isLength(value, { max: 64}), msg: 'Last name is too long. Maximum 64 chars.'}]
  }
}, { timestamps: true });

/**
 * Middleware
 */
userSchema.pre('save', hashPassword);

/**
 * Methods.
 */
userSchema.methods.comparePassword = comparePassword;

module.exports = mongoose.model('User', userSchema);
