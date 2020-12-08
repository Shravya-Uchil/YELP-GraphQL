const graphql = require('graphql');
//var crypt = require('../models/bcrypt.js');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
} = graphql;
const { customerSignup, restaurantSignup } = require('../mutations/signup');
const { login } = require('../mutations/login');
const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');
const MenuItemSchema = require('../models/menu_item');
const MenuCategory = require('../models/menu_category');
const Order = require('../models/order');
const Review = require('../models/review');
const mongoose = require('mongoose');
const { customerProfile } = require('../mutations/profile');
const { restaurantProfile } = require('../mutations/profile');
const { addReview } = require('../mutations/review');
const { addItem } = require('../mutations/menu');
const {
  placeOrder,
  updateOrderStatus,
  updateDeliveryStatus,
} = require('../mutations/order');
//const Sections = require('../models/SectionsSchema');
//const Items = require("../models/ItemsSchema");

const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    cust_name: { type: GraphQLString },
    email_id: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
    address: { type: GraphQLString },
    dob: { type: GraphQLString },
    nick_name: { type: GraphQLString },
    headline: { type: GraphQLString },
    yelp_since: { type: GraphQLString },
    things_love: { type: GraphQLString },
    find_me: { type: GraphQLString },
    blog_website: { type: GraphQLString },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const RestaurantType = new GraphQLObjectType({
  name: 'RestaurantType',
  fields: () => ({
    id: { type: GraphQLString },
    restaurant_name: { type: GraphQLString },
    email_id: { type: GraphQLString },
    phone_number: { type: GraphQLString },

    description: { type: GraphQLString },
    open_time: { type: GraphQLString },
    close_time: { type: GraphQLString },
    cuisine: { type: GraphQLString },
    curbside_pickup: { type: GraphQLBoolean },
    dine_in: { type: GraphQLBoolean },
    yelp_delivery: { type: GraphQLBoolean },
    restaurant_image: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    //menu_item
    //menu_category
    //order
    restaurant_name: { type: GraphQLString },
    email_id: { type: GraphQLString },
    password: { type: GraphQLString },
    zip_code: { type: GraphQLString },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const MenuItemType = new GraphQLObjectType({
  name: 'MenuItemType',
  fields: () => ({
    id: { type: GraphQLString },
    item_name: { type: GraphQLString },
    item_price: { type: GraphQLFloat },
    item_description: { type: GraphQLString },
    item_category: { type: GraphQLID },
    restaurant_id: { type: GraphQLID },
    item_image: { type: GraphQLString },
    item_ingredients: { type: GraphQLString },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const MenuItemListType = new GraphQLObjectType({
  name: 'MenuItemList',
  fields: () => ({
    items: { type: new GraphQLList(MenuItemType) },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const OrderItemType = new GraphQLObjectType({
  name: 'OrderItem',
  fields: () => ({
    item_id: { type: MenuItemType },
    item_quantity: { type: GraphQLInt },
  }),
});

const OrderItemInputType = new GraphQLInputObjectType({
  name: 'OrderItemInput',
  fields: () => ({
    item_id: { type: GraphQLString },
    item_quantity: { type: GraphQLInt },
  }),
});

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    order_id: { type: GraphQLString },
    order_type: { type: GraphQLString },
    order_status: { type: GraphQLString },
    order_delivery_status: { type: GraphQLString },
    order_date: { type: GraphQLString },
    order_cost: { type: GraphQLString },
    restaurant_id: { type: GraphQLString },
    customer_id: { type: GraphQLString },
    order_item: { type: new GraphQLList(OrderItemType) },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
    restaurant_name: { type: GraphQLString },
    restaurant_image: { type: GraphQLString },
    zip_code: { type: GraphQLString },
    customer_id: { type: GraphQLString },
    cust_name: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    city: { type: GraphQLString },
  }),
});

const OrderListType = new GraphQLObjectType({
  name: 'OrderList',
  fields: () => ({
    orders: { type: new GraphQLList(OrderType) },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const MenuCategoryType = new GraphQLObjectType({
  name: 'MenuCategory',
  fields: () => ({
    id: { type: GraphQLString },
    category_name: { type: GraphQLString },
    restaurant_id: { type: GraphQLID },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const MenuCategoryListType = new GraphQLObjectType({
  name: 'MenuCategoryList',
  fields: () => ({
    menu_categories: { type: new GraphQLList(MenuCategoryType) },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const AllRestaurantType = new GraphQLObjectType({
  name: 'AllRestaurant',
  fields: () => ({
    restaurants: { type: new GraphQLList(RestaurantType) },
    message: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const StatusType = new GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    status: { type: GraphQLString },
    message: { type: GraphQLString },
    id: { type: GraphQLString },
  }),
});

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    review_text: { type: GraphQLString },
    review_date: { type: GraphQLString },
    review_rating: { type: GraphQLInt },
    customer_id: { type: CustomerType },
    restaurant_id: { type: RestaurantType },
  }),
});

const ReviewListType = new GraphQLObjectType({
  name: 'ReviewList',
  fields: () => ({
    reviews: { type: new GraphQLList(ReviewType) },
    message: { type: GraphQLString },
    status: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        customer_id: {
          type: GraphQLString,
        },
      },
      async resolve(parent, args) {
        console.log(args.customer_id);
        let result = await Customer.findById(
          mongoose.Types.ObjectId(args.customer_id)
        );
        console.log(result);
        if (result) {
          result['status'] = 200;
          return result;
        } else {
          console.log('hererere');
          return { message: 'NO_RECORD', status: 401 };
        }
      },
    },

    allRestaurant: {
      type: AllRestaurantType,
      args: {
        search_str: {
          type: GraphQLString,
        },
      },
      async resolve(parent, args) {
        let restaurant = null;
        if (args.search_str != '_') {
          console.log('inside seach_str !=0');
          restaurant = await Restaurant.find({
            $or: [
              { restaurant_name: new RegExp(args.search_str, 'gi') },
              { description: new RegExp(args.search_str, 'gi') },
              { cuisine: new RegExp(args.search_str, 'gi') },
              {
                'menu_category.category_name': new RegExp(
                  args.search_str,
                  'gi'
                ),
              },
              { 'menu_item.item_name': new RegExp(args.search_str, 'gi') },
              {
                'menu_item.item_description': new RegExp(args.search_str, 'gi'),
              },
            ],
          });
        } else {
          console.log('Find all restaurants');
          restaurant = await Restaurant.find();
        }
        if (restaurant && restaurant.length > 0) {
          console.log('Found restaurants... ');
          result = {
            restaurants: restaurant,
            status: 200,
            message: 'RESTAURANT_FOUND',
          };
          return result;
        } else {
          return { message: 'NO_RECORD', status: 401 };
        }
      },
    },

    restaurant: {
      type: RestaurantType,
      args: {
        restaurant_id: {
          type: GraphQLString,
        },
      },
      async resolve(parent, args) {
        console.log(args.restaurant_id);
        let result = await Restaurant.findById(
          mongoose.Types.ObjectId(args.restaurant_id)
        );
        console.log(result);
        if (result) {
          result['status'] = 200;
          return result;
        } else {
          return { message: 'NO_RECORD', status: 401 };
        }
      },
    },

    menuItem: {
      type: MenuItemListType,
      args: {
        restaurant_id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log('Get items by restaurant id: ', args);
        try {
          let item = await MenuItemSchema.find({
            restaurant_id: args.restaurant_id,
          });
          if (item && item.length > 0) {
            console.log('item');
            console.log(item);
            var result = {
              items: item,
              status: 200,
            };
            return result;
          } else {
            return { message: 'NO_RECORD', status: 401 };
          }
        } catch (error) {
          console.log(error);
          return { message: 'Error in data', status: 500 };
        }
      },
    },

    menuCategory: {
      type: MenuCategoryListType,
      args: {
        restaurant_id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log('Get menu categories by restaurant id: ', args);
        try {
          let category = await MenuCategory.find({
            restaurant_id: args.restaurant_id,
          });
          console.log('category');
          console.log(category);
          if (category && category.length > 0) {
            console.log('category');
            console.log(category);
            var result = {
              menu_categories: category,
              status: 200,
            };
            console.log(result);
            return result;
          } else {
            return { message: 'NO_RECORD', status: 401 };
          }
        } catch (error) {
          console.log(error);
          return { message: 'Error in data', status: 500 };
        }
      },
    },

    menuCategoryById: {
      type: MenuCategoryType,
      args: {
        menu_category_id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log('Get menu categories by id: ', args);
        try {
          let category = await MenuCategory.findById(args.menu_category_id);
          if (category) {
            console.log('category');
            console.log(category);
            category['status'] = 200;

            return category;
          } else {
            return { message: 'NO_RECORD', status: 401 };
          }
        } catch (error) {
          console.log(error);
          return { message: 'Error in data', status: 500 };
        }
      },
    },

    restaurantReview: {
      type: ReviewListType,
      args: {
        restaurant_id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log('Get restaurant review by id: ', args);
        try {
          let review = await Review.find({
            restaurant_id: args.restaurant_id,
          });
          let i = 0;
          for (i = 0; i < review.length; i++) {
            await review[i]
              .populate('customer_id')
              .populate('restaurant_id')
              .execPopulate();
          }
          if (review) {
            console.log(review);
            var result = {
              reviews: review,
              message: 'RESTAURANT_REVIEW',
              status: 200,
            };
            return result;
          } else {
            return { message: 'NO_RECORD', status: 401 };
          }
        } catch (error) {
          console.log(error);
          return { message: 'Error in data', status: 500 };
        }
      },
    },

    customerOrder: {
      type: OrderListType,
      args: {
        customer_id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log('Get customer orders: ', args);
        try {
          let customer = await Customer.findById(args.customer_id);
          if (!customer) {
            return { status: 500, message: 'Error in data' };
          }
          let orders = await Order.find({ customer_id: args.customer_id });
          if (orders) {
            console.log('orders');
            console.log(orders);
            let data = [];
            for (let i = 0; i < orders.length; i++) {
              let restaurant = await Restaurant.findById(
                orders[i].restaurant_id
              );
              if (!restaurant) {
                return { status: 500, message: 'Error in data' };
              }
              let schema = {
                order_id: orders[i]._id,
                restaurant_id: orders[i].restaurant_id,
                order_status: orders[i].order_status,
                order_date: orders[i].order_date,
                order_cost: orders[i].order_cost,
                order_delivery_status: orders[i].order_delivery_status,
                order_type: orders[i].order_type,
                restaurant_name: restaurant.restaurant_name,
                zip_code: restaurant.zip_code,
                customer_id: customer._id,
                cust_name: customer.cust_name,
                phone_number: customer.phone_number,
                city: customer.city,
              };
              data.push(schema);
            }
            var result = {
              orders: data,
              status: 200,
            };
            return result;
          } else {
            return { status: 500, mmessage: 'NO_RECORD' };
          }
        } catch (error) {
          console.log(error);
          return { status: 500, mmessage: 'Err in Data' };
        }
      },
    },

    restaurantOrder: {
      type: OrderListType,
      args: {
        restaurant_id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log('Get restaurant orders: ', args);
        try {
          let restaurant = await Restaurant.findById(args.restaurant_id);
          if (!restaurant) {
            return { status: 500, message: 'Error in data' };
          }
          let orders = await Order.find({ restaurant_id: args.restaurant_id });
          if (orders) {
            console.log('orders');
            console.log(orders);
            let data = [];
            for (let i = 0; i < orders.length; i++) {
              let customer = await Customer.findById(orders[i].customer_id);
              if (!customer) {
                return { status: 500, message: 'Error in data' };
              }
              let schema = {
                order_id: orders[i]._id,
                restaurant_id: orders[i].restaurant_id,
                order_status: orders[i].order_status,
                order_date: orders[i].order_date,
                order_cost: orders[i].order_cost,
                order_delivery_status: orders[i].order_delivery_status,
                order_type: orders[i].order_type,
                restaurant_name: restaurant.restaurant_name,
                restaurant_image: restaurant.restaurant_image,
                zip_code: restaurant.zip_code,
                customer_id: customer._id,
                cust_name: customer.cust_name,
                phone_number: customer.phone_number,
                city: customer.city,
              };
              data.push(schema);
            }
            var result = {
              orders: data,
              status: 200,
            };
            return result;
          } else {
            return { status: 500, mmessage: 'NO_RECORD' };
          }
        } catch (error) {
          console.log(error);
          return { status: 500, mmessage: 'Err in Data' };
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    customerSignup: {
      type: StatusType,
      args: {
        cust_name: { type: GraphQLString },
        email_id: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return customerSignup(args);
      },
    },
    restaurantSignup: {
      type: StatusType,
      args: {
        restaurant_name: { type: GraphQLString },
        email_id: { type: GraphQLString },
        password: { type: GraphQLString },
        zip_code: { type: GraphQLString },
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat },
      },
      async resolve(parent, args) {
        return restaurantSignup(args);
      },
    },
    login: {
      type: StatusType,
      args: {
        email_id: { type: GraphQLString },
        password: { type: GraphQLString },
        login_type: { type: GraphQLString },
      },
      resolve(parent, args) {
        return login(args);
      },
    },

    customerProfile: {
      type: StatusType,
      args: {
        customer_id: { type: GraphQLString },
        email_id: { type: GraphQLString },
        cust_name: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
        nick_name: { type: GraphQLString },
        headline: { type: GraphQLString },
        yelp_since: { type: GraphQLString },
        dob: { type: GraphQLString },
        things_love: { type: GraphQLString },
        find_me: { type: GraphQLString },
        blog_website: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return customerProfile(args);
      },
    },

    restaurantProfile: {
      type: StatusType,
      args: {
        restaurant_id: { type: GraphQLString },
        email_id: { type: GraphQLString },
        restaurant_name: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
        description: { type: GraphQLString },
        cuisine: { type: GraphQLString },
        curbside_pickup: { type: GraphQLBoolean },
        dine_in: { type: GraphQLBoolean },
        yelp_delivery: { type: GraphQLBoolean },
        phone_number: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return restaurantProfile(args);
      },
    },

    addReview: {
      type: StatusType,
      args: {
        restaurant_id: { type: GraphQLString },
        customer_id: { type: GraphQLString },
        review_text: { type: GraphQLString },
        review_rating: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return addReview(args);
      },
    },

    addItem: {
      type: StatusType,
      args: {
        item_category: { type: GraphQLString },
        restaurant_id: { type: GraphQLString },
        item_id: { type: GraphQLString },
        item_name: { type: GraphQLString },
        item_description: { type: GraphQLString },
        item_price: { type: GraphQLString },
        item_image: { type: GraphQLString },
        item_ingredients: { type: GraphQLString },
      },
      resolve(parent, args) {
        return addItem(args);
      },
    },

    placeOrder: {
      type: StatusType,
      args: {
        order_type: { type: GraphQLString },
        order_status: { type: GraphQLString },
        order_cost: { type: GraphQLFloat },
        order_delivery_status: { type: GraphQLString },
        restaurant_id: { type: GraphQLString },
        customer_id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return placeOrder(args);
      },
    },

    updateDeliveryStatus: {
      type: StatusType,
      args: {
        order_id: { type: GraphQLString },
        order_delivery_status: { type: GraphQLString },
      },
      resolve(parent, args) {
        return updateDeliveryStatus(args);
      },
    },

    updateOrderStatus: {
      type: StatusType,
      args: {
        order_id: { type: GraphQLString },
        order_status: { type: GraphQLString },
      },
      resolve(parent, args) {
        return updateOrderStatus(args);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
