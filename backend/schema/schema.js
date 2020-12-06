const graphql = require('graphql');
//var crypt = require('../models/bcrypt.js');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const Customers = require('../models/customer');
const Restaurants = require('../models/restaurant');
const { customerSignup, restaurantSignup } = require('../mutations/signup');
const { login } = require('../mutations/login');
const Customer = require('../models/customer');
//const Sections = require('../models/SectionsSchema');
//const Items = require("../models/ItemsSchema");

const CustomerType = new GraphQLObjectType({
  name: 'CustomerType',
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
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
    /*order: {
        type: new GraphQLList(OrderType),
        resolve(parent, args) {
            return parent.order;
        }
    },*/
  }),
});

const StatusType = new GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    status: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      async resolve(parent, args) {
        let customer = await Customer.findById(args.id);
        if (customer) {
          return customer;
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
  },
});
/*const OwnerProfileType = new GraphQLObjectType({
  name: 'OwnerProfile',
  fields: () => ({
    ownerId: { type: GraphQLString },
    restaurantId: { type: GraphQLString },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    rname: { type: GraphQLString },
    cuisine: { type: GraphQLString },
    zipcode: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});
const ItemType = new graphql.GraphQLObjectType({
  name: 'Item',
  fields: function () {
    return {
      itemName: {
        type: graphql.GraphQLString,
      },
      itemDescription: {
        type: graphql.GraphQLString,
      },
      price: {
        type: graphql.GraphQLString,
      },
    };
  },
});
const OwnerSectionType = new GraphQLObjectType({
  name: 'OwnerSection',
  fields: () => ({
    _id: { type: GraphQLString },
    section_name: { type: GraphQLString },
    items: { type: new GraphQLList(ItemType) },
    email: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});
const SectionsFetchType = new GraphQLObjectType({
  name: 'SectionsFetch',
  fields: () => ({
    sections: { type: new GraphQLList(OwnerSectionType) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ownerProfilefetch: {
      type: OwnerProfileType,
      args: {
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        console.log('eee' + JSON.stringify(args));
        var l = args.email;
        console.log('emailemailemailemail' + l);
        return new Promise((resolve, reject) => {
          Owners.findOne({ email: l }, function (err, owner) {
            if (err) {
              console.log(err);
              console.log('Owner not found');
              let result = {
                message: 'Owner not found',
                status: 400,
              };
              resolve(result);
            } else {
              console.log('Owner profile fetch Successful');
              console.log('****' + args.email);
              console.log('owner' + JSON.stringify(owner));
              Restaurants.findOne(
                { email: owner.email },
                function (err, restaurant) {
                  if (err) {
                    console.log(err);
                    console.log('Restaurant not found');
                    let result = {
                      status: 400,
                      message: 'Database Error',
                    };
                    resolve(result);
                  } else {
                    console.log('restaurant:', restaurant);
                    console.log('Restaurant fetch Successful');
                    let result = {
                      ownerId: owner._id,
                      firstname: owner.first_name,
                      lastname: owner.last_name,
                      email: owner.email,
                      phone: owner.phone_number,
                      rname: restaurant.restaurant_name,
                      cuisine: restaurant.cuisine,
                      zipcode: restaurant.zip_code,
                      restaurantId: restaurant._id,
                      status: 200,
                      message: 'Owner/Rest profile fetched successfully',
                    };
                    resolve(result);
                  }
                }
              );
            }
          });
        });
      },
    },
    customerProfilefetch: {
      type: CustomerProfileType,
      args: {
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Customers.findOne({ email: args.email }, function (err, customer) {
            if (err) {
              console.log(err);
              console.log('Customer not found');
              let result = {
                message: 'Customer not found',
                status: 400,
              };
              resolve(result);
            } else {
              console.log('user:', customer);
              console.log('Customer profile fetch Successful');
              let result = {
                customerId: customer._id,
                firstname: customer.first_name,
                lastname: customer.last_name,
                email: customer.email,
                phone: customer.phone_number,
                status: 200,
                message: 'Customer profile fetch Successful',
              };
              resolve(result);
            }
          });
        });
      },
    },
    sectionFetch: {
      type: SectionsFetchType,
      args: {
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Sections.find({ email: args.email }, function (err, sections) {
            if (err) {
              console.log(err);
              console.log('Section not found');
              let result = {
                message: 'Section not found',
                status: 400,
              };
              resolve(result);
            } else {
              console.log('sections:', sections);
              console.log('Sections fetch Successful');
              let result = {
                sections: sections,
                status: 200,
                message: 'Customer profile fetch Successful',
              };
              resolve(result);
            }
          });
        });
      },
    },
    allSectionFetch: {
      type: SectionsFetchType,
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Sections.find({}, function (err, sections) {
            if (err) {
              console.log(err);
              console.log('Section not found');
              let result = {
                message: 'Section not found',
                status: 400,
              };
              resolve(result);
            } else {
              console.log('sections:', sections);
              console.log('Sections fetch Successful');
              let result = {
                sections: sections,
                status: 200,
                message: 'Customer profile fetch Successful',
              };
              resolve(result);
            }
          });
        });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ownerSignUp: {
      type: OwnerLoginType,
      args: {
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        rname: { type: GraphQLString },
        cuisine: { type: GraphQLString },
        zipcode: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Owners.findOne({ email: args.email }, function (err, rows) {
            if (err) {
              console.log(err);
              console.log('unable to read the database');
              let result = {
                cookie1: null,
                cookie2: null,
                cookie3: null,
                cookie4: null,
                status: 400,
                message: 'Database Error',
              };
              resolve(result);
            } else {
              console.log('rows', rows);
              if (rows) {
                console.log('Owner already exists');
                let result = {
                  cookie1: null,
                  cookie2: null,
                  cookie3: null,
                  cookie4: null,
                  status: 401,
                  message: 'Owner already exists',
                };
                resolve(result);
              } else {
                crypt.createHash(args.password, function (response) {
                  encryptedPassword = response;

                  var restaurantData = {
                    restaurant_name: args.rname,
                    cuisine: args.cuisine,
                    email: args.email,
                    zip_code: args.zipcode,
                  };
                  var userData = {
                    first_name: args.firstname,
                    last_name: args.lastname,
                    email: args.email,
                    password: encryptedPassword,
                  };

                  //Save the owner and restaurant in the database
                  Owners.create(userData, function (err, user) {
                    if (err) {
                      console.log(err);
                      console.log('unable to update user to owner');
                      let result = {
                        cookie1: null,
                        cookie2: null,
                        cookie3: null,
                        cookie4: null,
                        status: 400,
                        message: 'Database Error',
                      };
                      resolve(result);
                    } else {
                      console.log('Owner Added');
                      Restaurants.create(
                        restaurantData,
                        function (err, restaurant) {
                          if (err) {
                            console.log(err);
                            console.log('unable to update user to owner');
                            let result = {
                              cookie1: null,
                              cookie2: null,
                              cookie3: null,
                              cookie4: null,
                              status: 400,
                              message: 'Database Error',
                            };
                            resolve(result);
                          } else {
                            console.log('Restaurant Added');
                            let result = {
                              cookie1: 'ownercookie',
                              cookie2: args.email,
                              cookie3: args.firstname,
                              cookie4: args.lastname,
                              status: 200,
                              message:
                                'Successfully added the owner and the restaurant',
                            };
                            resolve(result);
                          }
                        }
                      );
                    }
                  });
                });
              }
            }
          });
        });
      },
    },
    customerSignUp: {
      type: CustomerLoginType,
      args: {
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Customers.findOne({ email: args.email }, function (err, rows) {
            if (err) {
              console.log(err);
              console.log('unable to read the database');
              let result = {
                cookie1: null,
                cookie2: null,
                cookie3: null,
                cookie4: null,
                status: 400,
                message: 'Database Error',
              };
              resolve(result);
            } else {
              console.log('rows', rows);
              if (rows) {
                console.log('Customer already exists');
                let result = {
                  cookie1: null,
                  cookie2: null,
                  cookie3: null,
                  cookie4: null,
                  status: 401,
                  message: 'Customer already exists',
                };
                resolve(result);
              } else {
                crypt.createHash(args.password, function (response) {
                  encryptedPassword = response;

                  var userData = {
                    first_name: args.firstname,
                    last_name: args.lastname,
                    email: args.email,
                    password: encryptedPassword,
                  };

                  //Save the owner and restaurant in the database
                  Customers.create(userData, function (err, user) {
                    if (err) {
                      console.log(err);
                      console.log('unable to update user to owner');
                      let result = {
                        cookie1: null,
                        cookie2: null,
                        cookie3: null,
                        cookie4: null,
                        status: 400,
                        message: 'Database Error',
                      };
                      resolve(result);
                    } else {
                      console.log('Customer Added');
                      let result = {
                        cookie1: 'customercookie',
                        cookie2: args.email,
                        cookie3: args.firstname,
                        cookie4: args.lastname,
                        status: 200,
                        message: 'Customer added succesfully',
                      };
                      resolve(result);
                    }
                  });
                });
              }
            }
          });
        });
      },
    },
    ownerLogin: {
      type: OwnerLoginType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Owners.findOne({ email: args.email }, function (err, user) {
            if (err) {
              console.log(err);
              console.log('unable to read the database');
              let result = {
                message: 'unable to read the database',
                cookie1: null,
                cookie2: null,
                cookie3: null,
                cookie4: null,
                status: 400,
              };

              resolve(result);
            } else if (user) {
              console.log('Owner:', user);
              crypt.compareHash(
                args.password,
                user.password,
                function (err, isMatch) {
                  if (isMatch && !err) {
                    console.log('Owner Login Successful');
                    let result = {
                      message: 'Owner Login Successful',
                      cookie1: 'ownercookie',
                      cookie2: args.email,
                      cookie3: user.first_name,
                      cookie4: user.last_name,
                      status: 200,
                    };
                    resolve(result);
                  } else {
                    let result = {
                      message: 'Authentication failed. Passwords did not match',
                      cookie1: null,
                      cookie2: null,
                      cookie3: null,
                      cookie4: null,
                      status: 401,
                    };
                    console.log(
                      'Authentication failed. Passwords did not match'
                    );
                    resolve(result);
                  }
                }
              );
            } else {
              console.log('Authentication failed. Owner does not exist.');
              let result = {
                message: 'Authentication failed. Owner does not exist.',
                cookie1: null,
                cookie2: null,
                cookie3: null,
                cookie4: null,
                status: 402,
              };
              resolve(result);
            }
          });
        });
      },
    },
    customerLogin: {
      type: CustomerLoginType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Customers.findOne({ email: args.email }, function (err, user) {
            if (err) {
              console.log(err);
              console.log('unable to read the database');
              let result = {
                message: 'unable to read the database',
                cookie1: null,
                cookie2: null,
                cookie3: null,
                cookie4: null,
                status: 400,
              };
              resolve(result);
            } else if (user) {
              console.log('customer:', user);
              crypt.compareHash(
                args.password,
                user.password,
                function (err, isMatch) {
                  if (isMatch && !err) {
                    console.log('Customer Login Successful');
                    let result = {
                      message: 'Customer Login Successful',
                      cookie1: 'customercookie',
                      cookie2: args.email,
                      cookie3: user.first_name,
                      cookie4: user.last_name,
                      status: 200,
                    };
                    resolve(result);
                  } else {
                    console.log(
                      'Authentication failed. Passwords did not match'
                    );
                    let result = {
                      message: 'Authentication failed. Passwords did not match',
                      cookie1: null,
                      cookie2: null,
                      cookie3: null,
                      cookie4: null,
                      status: 402,
                    };
                    resolve(result);
                  }
                }
              );
            } else {
              console.log('Authentication failed. User does not exist.');
              let result = {
                message: 'Authentication failed. Customer does not exist.',
                cookie1: null,
                cookie2: null,
                cookie3: null,
                cookie4: null,
                status: 402,
              };
              resolve(result);
            }
          });
        });
      },
    },
    customerProfileSave: {
      type: CustomerProfileType,
      args: {
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          var userData = {
            first_name: args.firstname,
            last_name: args.lastname,
            phone_number: args.phone,
          };
          Customers.findOneAndUpdate(
            { email: args.email },
            userData,
            { new: true },
            function (err, customer) {
              if (err) {
                console.log(err);
                console.log('unable to update database');
                let result = {
                  message: 'unable to update database',
                  status: 400,
                };
                resolve(result);
              } else {
                console.log('result:', customer);
                console.log('Customer Profile save Successful');
                let result = {
                  customerId: customer._id,
                  firstname: customer.first_name,
                  lastname: customer.last_name,
                  email: customer.email,
                  phone: customer.phone_number,
                  status: 200,
                  message: 'Customer Profile save Successful',
                };
                resolve(result);
              }
            }
          );
        });
      },
    },
    ownerProfileSave: {
      type: OwnerProfileType,
      args: {
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        rname: { type: GraphQLString },
        cuisine: { type: GraphQLString },
        zipcode: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          var ownerData = {
            first_name: args.firstname,
            last_name: args.lastname,
            phone_number: args.phone,
          };

          var restaurantData = {
            restaurant_name: args.rname,
            cuisine: args.cuisine,
            email: args.email,
            zip_code: args.zipcode,
          };
          Owners.findOneAndUpdate(
            { email: args.email },
            ownerData,
            { new: true },
            function (err, owner) {
              if (err) {
                console.log(err);
                console.log('unable to update database');
                let result = {
                  message: 'unable to update database',
                  status: 400,
                };
                resolve(result);
              } else {
                console.log('result:', owner);
                console.log('Owner Profile save Successful');

                Restaurants.findOneAndUpdate(
                  { email: args.email },
                  restaurantData,
                  { new: true },
                  function (err, restaurant) {
                    if (err) {
                      console.log(err);
                      console.log('unable to update database');
                      let result = {
                        message: 'unable to update database',
                        status: 400,
                      };
                      resolve(result);
                    } else {
                      console.log('result:', restaurant);
                      console.log('Restaurant details Successfully updated');
                      let result = {
                        ownerId: owner._id,
                        firstname: owner.first_name,
                        lastname: owner.last_name,
                        email: owner.email,
                        phone: owner.phone_number,
                        rname: restaurant.restaurant_name,
                        cuisine: restaurant.cuisine,
                        zipcode: restaurant.zip_code,
                        restaurantId: restaurant._id,
                        status: 200,
                        message: 'Owner/Rest successfully updated',
                      };
                      resolve(result);
                    }
                  }
                );
              }
            }
          );
        });
      },
    },
    addSection: {
      type: OwnerSectionType,
      args: {
        email: { type: GraphQLString },
        section_name: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          console.log('%%%');
          var sectionData = {
            section_name: args.section_name,
            email: args.email,
            items: [],
          };
          Sections.findOne(
            { section_name: args.section_name },
            function (err, rows) {
              if (err) {
                console.log(err);
                console.log('unable to read the database');
                let result = {
                  status: 400,
                  message: 'Database Error',
                };
                resolve(result);
              } else {
                console.log('rows', rows);
                if (rows) {
                  console.log('Section already exists');
                  let result = {
                    _id: rows._id,
                    section_name: rows.section_name,
                    email: rows.email,
                    items: rows.items,
                    status: 401,
                    message: 'Section already exists',
                  };
                  resolve(result);
                } else {
                  Sections.create(sectionData, function (err, section) {
                    if (err) {
                      console.log(err);
                      console.log('unable to update user to owner');
                      let result = {
                        status: 400,
                        message: 'Database Error',
                      };
                      resolve(result);
                    } else {
                      console.log('Section Added');
                      let result = {
                        _id: section._id,
                        section_name: section.section_name,
                        items: section.items,
                        email: section.email,
                        status: 200,
                        message: 'Section Added',
                      };
                      resolve(result);
                    }
                  });
                }
              }
            }
          );
        });
      },
    },
    addItem: {
      type: OwnerSectionType,
      args: {
        email: { type: GraphQLString },
        section_name: { type: GraphQLString },
        itemName: { type: GraphQLString },
        itemDescription: { type: GraphQLString },
        price: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          var itemData = {
            itemName: args.itemName,
            itemDescription: args.itemDescription,
            price: args.price,
          };
          Sections.findOne(
            { email: args.email, section_name: args.section_name },
            function (err, rows) {
              if (err) {
                console.log(err);
                console.log('unable to read the database');
                let result = {
                  status: 400,
                  message: 'Database Error',
                };
                resolve(result);
              } else {
                console.log('rows', rows);
                if (rows) {
                  console.log('Section exists');
                  rows.items.push(itemData);
                  rows.save(function (err, section) {
                    if (err) {
                      console.log(err);
                      console.log('unable to update database');
                      let result = {
                        status: 400,
                        message: 'Database Error',
                      };
                      resolve(result);
                    } else {
                      console.log('result:', section);
                      console.log('Item Profile save Successful');
                      let result = {
                        _id: section._id,
                        section_name: section.section_name,
                        email: section.email,
                        items: section.items,
                        status: 200,
                        message: 'Item included successfully',
                      };
                      resolve(result);
                    }
                  });
                } else {
                  let result = {
                    status: 401,
                    message: 'Section not available',
                  };
                  resolve(result);
                }
              }
            }
          );
        });
      },
    },
  },
});*/

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
