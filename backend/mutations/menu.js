const MenuItem = require('../models/menu_item');
const MenuCategory = require('../models/menu_category');

const addItem = async (args) => {
  console.log('Add item: ', args);
  try {
    let category = await MenuCategory.findOne({
      $and: [
        { category_name: args.item_category },
        { restaurant_id: args.restaurant_id },
      ],
    });
    var savedCategory = category;
    if (!category) {
      let newCategory = new MenuCategory({
        category_name: args.item_category,
        restaurant_id: args.restaurant_id,
      });
      savedCategory = await newCategory.save();
    }
    if (!savedCategory) {
      return { status: 500, message: 'Data error' };
    }

    if (args.item_id != null) {
      // update
      let item = await MenuItem.findById(args.item_id);
      console.log('item');
      console.log(item);
      if (item) {
        item.item_name = args.item_name;
        item.item_description = args.item_description;
        item.item_price = args.item_price;
        item.item_image = args.item_image;
        item.item_ingredients = args.item_ingredients;
        item.item_category = savedCategory._id;
        item.restaurant_id = args.restaurant_id;
        let savedItem = await item.save();
        return { id: savedItem._id, message: 'ITEM_UPDATED', status: 200 };
      } else {
        return { status: 500, message: 'Data error' };
      }
    } else {
      let item = new MenuItem({
        item_name: args.item_name,
        item_description: args.item_description,
        item_price: args.item_price,
        item_image: args.item_image,
        item_ingredients: args.item_ingredients,
        item_category: savedCategory._id,
        restaurant_id: args.restaurant_id,
      });
      let savedItem = await item.save();
      if (savedItem) {
        return { id: savedItem._id, message: 'ITEM_ADDED', status: 200 };
      } else {
        return { status: 500, message: 'Data error' };
      }
    }
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Data error' };
  }
};

exports.addItem = addItem;
