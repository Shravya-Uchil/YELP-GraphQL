const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');
const passwordHash = require('password-hash');

const customerProfile = async (args) => {
  let err = {};
  let response = {};
  console.log('Update customer: ', args);
  try {
    let customerObj = await Customer.findById(args.customer_id);
    if (customerObj) {
      customerObj.cust_name = customerObj.cust_name || args.cust_name;
      customerObj.city = args.city;
      customerObj.state = args.state;
      customerObj.country = args.country;
      customerObj.nick_name = args.nick_name;
      customerObj.headline = args.headline;
      customerObj.yelp_since = args.yelp_since;
      customerObj.dob = args.dob;
      customerObj.things_love = args.things_love;
      customerObj.find_me = args.find_me;
      customerObj.blog_website = args.blog_website;
      customerObj.phone_number = args.phone_number;

      if (args.password && args.password !== '') {
        customerObj.password = passwordHash.generate(args.password);
      }
      const updatedCustomer = await customerObj.save();
      if (updatedCustomer) {
        return { status: 200, message: 'CUSTOMER_UPDATED' };
      } else {
        return { status: 500, message: 'Error in saving data' };
      }
    } else {
      console.log(error);
      return { status: 401, message: 'NO_RECORD' };
    }
  } catch (error) {
    console.log('catch error');
    console.log(error);
    return { status: 500, message: 'Error in Data' };
  }
};

const restaurantProfile = async (args) => {
  let err = {};
  let response = {};
  console.log('Update restaurant: ', args);
  try {
    let restaurantObj = await Restaurant.findById(args.restaurant_id);

    if (restaurantObj) {
      restaurantObj.restaurant_name =
        restaurantObj.restaurant_name || args.restaurant_name;
      restaurantObj.zip_code = restaurantObj.zip_code || args.zip_code;
      restaurantObj.phone_number = args.phone_number;
      restaurantObj.description = args.description;
      restaurantObj.cuisine = args.cuisine;
      restaurantObj.curbside_pickup = args.curbside_pickup;
      restaurantObj.dine_in = args.dine_in;
      restaurantObj.yelp_delivery = args.yelp_delivery;

      if (args.password && args.password !== '') {
        restaurantObj.password = await bcrypt.hash(args.password, 12);
      }
      const updatedRestaurant = await restaurantObj.save();
      if (updatedRestaurant) {
        return { status: 200, message: 'RESTAURANT_UPDATED' };
      } else {
        return { status: 500, message: 'Error in saving data' };
      }
    } else {
      return { status: 401, message: 'NO_RECORD' };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Error in Data' };
  }
};

exports.customerProfile = customerProfile;
exports.restaurantProfile = restaurantProfile;
