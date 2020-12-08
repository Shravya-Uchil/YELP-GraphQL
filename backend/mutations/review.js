const Review = require('../models/review');
//const Restaurant = require('../models/restaurant');
//const passwordHash = require('password-hash');

const addReview = async (args) => {
  console.log('Add restaurant review: ', args);
  try {
    let reviewExists = await Review.findOne({
      $and: [
        { restaurant_id: args.restaurant_id },
        { customer_id: args.customer_id },
      ],
    });

    if (!reviewExists) {
      let review = new Review({
        review_text: args.review_text,
        review_date: new Date(Date.now()),
        review_rating: args.review_rating,
        customer_id: args.customer_id,
        restaurant_id: args.restaurant_id,
      });
      let addedReview = await review.save();
      if (addedReview) {
        return { status: 200, message: 'REVIEW_ADDED' };
      } else {
        return { status: 500, message: 'Error in Data' };
      }
    } else {
      return { status: 200, message: 'REVIEW_EXISTS' };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Error in Data' };
  }
};

exports.addReview = addReview;
//exports.restaurantSignup = restaurantSignup;
