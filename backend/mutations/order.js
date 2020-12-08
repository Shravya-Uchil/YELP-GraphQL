const MenuItem = require('../models/menu_item');
const MenuCategory = require('../models/menu_category');
const Order = require('../models/order');

const placeOrder = async (args) => {
  console.log('Place order: ', args);
  let err = {};
  let response = {};
  console.log('Place order: ', args);
  try {
    /// \todo validate res_id and item id
    /*let res = await Restaurant.findById(msg.body.restaurant_id);
    let cust = await Customer.findById(msg.body.customer_id);
    if (!cust || !res) {
      response.status = 500;
      response.data = "ORDER_ERROR";
      return callback(null, response);
    } else {*/
    // let sql = `CALL add_order('${req.body.customer_id}', '${req.body.restaurant_id}',
    // '${req.body.order_status}','${req.body.order_cost}', '${req.body.order_type}', '${req.body.order_delivery_status}');`;
    let newOrder = new Order({
      order_type: args.order_type,
      order_status: args.order_status,
      order_cost: args.order_cost,
      order_delivery_status: args.order_delivery_status,
      customer_id: args.customer_id,
      restaurant_id: args.restaurant_id,
      order_date: new Date(Date.now()),
      order_item: [],
    });
    /**let i = 0;
    for (i = 0; i < args.cart_items.length; i++) {
      let item = await MenuItem.findById(args.cart_items[i].item_id);
      if (!item) {
        return { status: 500, message: 'Error in Data' };
      } else {
        let data = {
          item_id: item._id,
          item_quantity: args.cart_items[i].item_quantity,
        };
        newOrder.order_item.push(data);
      }
    }*/
    console.log(newOrder);
    console.log('newOrder');
    let savedOrder = await newOrder.save();
    if (!savedOrder) {
      return { status: 500, message: 'Error in Data' };
    } else {
      return { status: 200, message: 'ORDER_PLACED' };
    }
  } catch (error) {
    return { status: 500, message: 'Error in Data' };
  }
};

const updateDeliveryStatus = async (args) => {
  console.log('update delivery status: ', args);
  try {
    let order = await Order.findById(args.order_id);
    if (order) {
      order.order_delivery_status = args.order_delivery_status;
      let updated = await order.save();
      if (updated) {
        return { status: 200, message: 'UPDATED_DELIVERY_STATUS' };
      } else {
        return { status: 500, message: 'Error in Data' };
      }
    } else {
      return { status: 500, message: 'NO_RECORD' };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Error in Data' };
  }
};

const updateOrderStatus = async (args) => {
  console.log('update order status: ', args);
  try {
    let order = await Order.findById(args.order_id);
    if (order) {
      order.order_status = args.order_status;
      let updated = await order.save();
      if (updated) {
        return { status: 200, message: 'UPDATED_ORDER_STATUS' };
      } else {
        return { status: 500, message: 'NO_RECORD' };
      }
    } else {
      return { status: 500, message: 'NO_RECORD' };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Error in Data' };
  }
};

exports.placeOrder = placeOrder;
exports.updateDeliveryStatus = updateDeliveryStatus;
exports.updateOrderStatus = updateOrderStatus;
