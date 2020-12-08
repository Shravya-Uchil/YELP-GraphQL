import { gql } from 'apollo-boost';

const getAllRestaurantQuery = gql`
  query allRestaurant($search_str: String) {
    allRestaurant(search_str: $search_str) {
      restaurants {
        id
        restaurant_name
        email_id
        phone_number
        description
        open_time
        close_time
        cuisine
        curbside_pickup
        dine_in
        yelp_delivery
        restaurant_image
        lat
        lng
        restaurant_name
        email_id
        password
        zip_code
        message
        status
      }
      message
      status
    }
  }
`;

const getCustomerQuery = gql`
  query customer($customer_id: String) {
    customer(customer_id: $customer_id) {
      id
      cust_name
      email_id
      phone_number
      city
      state
      country
      address
      dob
      nick_name
      headline
      yelp_since
      things_love
      find_me
      blog_website
      message
      status
    }
  }
`;

const getRestaurantProfileQuery = gql`
  query restaurant($restaurant_id: String) {
    restaurant(restaurant_id: $restaurant_id) {
      id
      restaurant_name
      email_id
      phone_number
      description
      open_time
      close_time
      cuisine
      curbside_pickup
      dine_in
      yelp_delivery
      restaurant_image
      lat
      lng
      password
      zip_code
      message
      status
    }
  }
`;

const getCategoriesForRestaurantQuery = gql`
  query menuCategory($restaurant_id: String) {
    menuCategory(restaurant_id: $restaurant_id) {
      menu_categories {
        id
        category_name
        restaurant_id
      }
      message
      status
    }
  }
`;

const getItemsForRestaurantQuery = gql`
  query menuItem($restaurant_id: String) {
    menuItem(restaurant_id: $restaurant_id) {
      items {
        id
        item_name
        item_price
        item_description
        item_category
        restaurant_id
        item_image
        item_ingredients
      }
      message
      status
    }
  }
`;

const getMenuCategoryByIdQuery = gql`
  query menuCategoryById($menu_category_id: String) {
    menuCategoryById(menu_category_id: $menu_category_id) {
      category_name
      status
    }
  }
`;

const getRestaurantOrderQuery = gql`
  query restaurantOrder($restaurant_id: String) {
    restaurantOrder(restaurant_id: $restaurant_id) {
      orders {
        order_id
        order_type
        order_status
        order_delivery_status
        order_date
        order_cost
        restaurant_id
        customer_id
        message
        status
        restaurant_name
        restaurant_image
        zip_code
        cust_name
        phone_number
        city
      }
      message
      status
    }
  }
`;

const getCustomerOrderQuery = gql`
  query customerOrder($customer_id: String) {
    customerOrder(customer_id: $customer_id) {
      orders {
        order_id
        order_type
        order_status
        order_delivery_status
        order_date
        order_cost
        restaurant_id
        customer_id
        message
        status
        restaurant_name
        restaurant_image
        zip_code
        cust_name
        phone_number
        city
      }
      message
      status
    }
  }
`;

const getRestaurantReviewQuery = gql`
  query restaurantReview($restaurant_id: String) {
    restaurantReview(restaurant_id: $restaurant_id) {
      reviews {
        review_text
        review_date
        review_rating
        customer_id {
          cust_name
        }
        restaurant_id {
          restaurant_name
        }
      }
      message
      status
    }
  }
`;

export {
  getAllRestaurantQuery,
  getCustomerQuery,
  getRestaurantProfileQuery,
  getCategoriesForRestaurantQuery,
  getItemsForRestaurantQuery,
  getMenuCategoryByIdQuery,
  getRestaurantOrderQuery,
  getCustomerOrderQuery,
  getRestaurantReviewQuery,
};
