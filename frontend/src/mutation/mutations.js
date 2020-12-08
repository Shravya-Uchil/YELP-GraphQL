import { gql } from 'apollo-boost';

const customerSignupMutation = gql`
  mutation customerSignup(
    $cust_name: String
    $email_id: String
    $password: String
  ) {
    customerSignup(
      cust_name: $cust_name
      email_id: $email_id
      password: $password
    ) {
      message
      status
    }
  }
`;

const restaurantSignupMutation = gql`
  mutation restaurantSignup(
    $restaurant_name: String
    $email_id: String
    $password: String
    $zip_code: String
    $lat: Float
    $lng: Float
  ) {
    restaurantSignup(
      restaurant_name: $restaurant_name
      email_id: $email_id
      password: $password
      zip_code: $zip_code
      lat: $lat
      lng: $lng
    ) {
      message
      status
    }
  }
`;

const loginMutation = gql`
  mutation login($email_id: String, $password: String, $login_type: String) {
    login(email_id: $email_id, password: $password, login_type: $login_type) {
      message
      status
    }
  }
`;

const updateCustomerProfileMutation = gql`
  mutation customerProfile(
    $customer_id: String
    $email_id: String
    $cust_name: String
    $city: String
    $state: String
    $country: String
    $nick_name: String
    $headline: String
    $yelp_since: String
    $dob: String
    $things_love: String
    $find_me: String
    $blog_website: String
    $phone_number: String
    $password: String
  ) {
    customerProfile(
      customer_id: $customer_id
      email_id: $email_id
      cust_name: $cust_name
      city: $city
      state: $state
      country: $country
      nick_name: $nick_name
      headline: $headline
      yelp_since: $yelp_since
      dob: $dob
      things_love: $things_love
      find_me: $find_me
      blog_website: $blog_website
      phone_number: $phone_number
      password: $password
    ) {
      message
      status
    }
  }
`;

const updateRestaurantProfileMutation = gql`
  mutation restaurantProfile(
    $restaurant_id: String
    $email_id: String
    $restaurant_name: String
    $city: String
    $state: String
    $country: String
    $description: String
    $cuisine: String
    $curbside_pickup: Boolean
    $dine_in: Boolean
    $yelp_delivery: Boolean
    $phone_number: String
    $password: String
  ) {
    restaurantProfile(
      restaurant_id: $restaurant_id
      email_id: $email_id
      restaurant_name: $restaurant_name
      city: $city
      state: $state
      country: $country
      description: $description
      cuisine: $cuisine
      curbside_pickup: $curbside_pickup
      dine_in: $dine_in
      yelp_delivery: $yelp_delivery
      phone_number: $phone_number
      password: $password
    ) {
      message
      status
    }
  }
`;

const addReviewMutation = gql`
  mutation addReview(
    $restaurant_id: String
    $customer_id: String
    $review_text: String
    $review_rating: Int
  ) {
    addReview(
      restaurant_id: $restaurant_id
      customer_id: $customer_id
      review_text: $review_text
      review_rating: $review_rating
    ) {
      message
      status
    }
  }
`;

const addItemMutation = gql`
  mutation addItem(
    $item_category: String
    $restaurant_id: String
    $item_id: String
    $item_name: String
    $item_description: String
    $item_price: String
    $item_image: String
    $item_ingredients: String
  ) {
    addItem(
      item_category: $item_category
      restaurant_id: $restaurant_id
      item_id: $item_id
      item_name: $item_name
      item_description: $item_description
      item_price: $item_price
      item_image: $item_image
      item_ingredients: $item_ingredients
    ) {
      message
      status
      id
    }
  }
`;

const placeOrderMutation = gql`
  mutation placeOrder(
    $order_type: String
    $order_status: String
    $order_cost: Float
    $order_delivery_status: String
    $restaurant_id: String
    $customer_id: String
  ) {
    placeOrder(
      order_type: $order_type
      order_status: $order_status
      order_cost: $order_cost
      order_delivery_status: $order_delivery_status
      restaurant_id: $restaurant_id
      customer_id: $customer_id
    ) {
      message
      status
    }
  }
`;

const updateDeliveryStatusMutation = gql`
  mutation updateDeliveryStatus(
    $order_id: String
    $order_delivery_status: String
  ) {
    updateDeliveryStatus(
      order_id: $order_id
      order_delivery_status: $order_delivery_status
    ) {
      message
      status
    }
  }
`;

const updateOrderStatusMutation = gql`
  mutation updateOrderStatus($order_id: String, $order_status: String) {
    updateOrderStatus(order_id: $order_id, order_status: $order_status) {
      message
      status
    }
  }
`;

export {
  customerSignupMutation,
  restaurantSignupMutation,
  loginMutation,
  updateRestaurantProfileMutation,
  updateCustomerProfileMutation,
  addReviewMutation,
  addItemMutation,
  placeOrderMutation,
  updateOrderStatusMutation,
  updateDeliveryStatusMutation,
};
