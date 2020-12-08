const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');
const passwordHash = require('password-hash');

const customerSignup = async (args) => {
  let hashedPassword = passwordHash.generate(args.password);
  let newCustomer = new Customer({
    cust_name: args.cust_name,
    email_id: args.email_id,
    password: hashedPassword,
  });
  let customer = await Customer.find({ email_id: args.email_id });
  if (customer.length) {
    return { status: 400, message: 'CUSTOMER_EXISTS' };
  }
  let savedCustomer = await newCustomer.save();
  if (savedCustomer) {
    return { status: 200, message: 'CUSTOMER_ADDED' };
  } else {
    return { status: 500, message: 'INTERNAL_SERVER_ERROR' };
  }
};

const restaurantSignup = async (args) => {
  let restaurant = await Restaurant.find({ email_id: args.email_id });
  if (restaurant.length) {
    return { status: 400, message: 'RESTAURANT_EXISTS' };
  }

  let hashedPassword = passwordHash.generate(args.password);
  let newRestaurant = new Restaurant({
    restaurant_name: args.restaurant_name,
    email_id: args.email_id,
    password: hashedPassword,
    zip_code: args.zip_code,
    lat: args.lat,
    lng: args.lng,
  });

  let savedRestaurant = await newRestaurant.save();
  if (savedRestaurant) {
    return { status: 200, message: 'RESTAURANT_ADDED' };
  } else {
    return { status: 500, message: 'INTERNAL_SERVER_ERROR' };
  }
};

exports.customerSignup = customerSignup;
exports.restaurantSignup = restaurantSignup;
