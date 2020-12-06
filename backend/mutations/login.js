const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');

const login = async (args) => {
  let user = Restaurant;
  var payload = {};
  if (args.login_type === 'customer') {
    user = Customer;
  }
  let result = await user.findOne({ email_id: args.email_id });
  if (result.length === 0) {
    return { status: 401, message: 'NO_RECORD' };
  }
  if (passwordHash.verify(args.password, result.password)) {
    if (args.login_type === 'customer') {
      payload = {
        id: result._id,
        cust_name: result.cust_name,
        email_id: result.email_id,
        login_type: 0,
      };
    } else {
      payload = {
        id: result._id,
        restaurant_name: result.restaurant_name,
        email_id: result.email_id,
        login_type: 1,
      };
    }
    var token = jwt.sign(payload, secret, {
      expiresIn: 1008000,
    });
    token = 'JWT ' + token;
    return { status: 200, message: token };
    //return { status: 200, message: JSON.stringify(payload) };
  } else {
    return { status: 401, message: 'INCORRECT_PASSWORD' };
  }
};

exports.login = login;
