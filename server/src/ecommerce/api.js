//models
const eventsModel = require("@markab.io/orbital-api/MongoDb/models/events");
const cartsModel = require("@markab.io/orbital-api/MongoDb/models/carts");
const ordersModel = require("@markab.io/orbital-api/MongoDb/models/orders");
const reviewsModel = require("@markab.io/orbital-api/MongoDb/models/reviews");
const categoriesModel = require("@markab.io/orbital-api/MongoDb/models/categories");
const productsModel = require("@markab.io/orbital-api/MongoDb/models/products");
//api
const productsApi = require("./Products");
const categoriesApi = require("./Categories");
const cartsApi = require("./Carts");
const ordersApi = require("./Orders");
const reviewsApi = require("./Reviews");
const eventsApi = require("./Events");
// const stripeService = require("@markab.io/node/stripe-service/stripe-service");

//api
const Api = ({
  config,
  kernelModel,
  userModel,
  permissionsModel,
  settingsModel,
  formsModel,
  notificationsModel
}) => {
  const defaultProps = {
    kernelModel,
    permissionsModel,
    settingsModel,
    formsModel,
    notificationsModel
  };
  let eventsApiRoutes = eventsApi({
    config,
    eventsModel,
    ...defaultProps
  });
  let productsApiRoutes = productsApi({
    config,
    productsModel,
    ...defaultProps
  });
  let categoriesApiRoutes = categoriesApi({
    config,
    categoriesModel,
    ...defaultProps
  });
  let cartsApiRoutes = cartsApi({
    config,
    cartsModel,
    ...defaultProps
  });
  let ordersApiRoutes = ordersApi({
    config,
    ordersModel,
    ...defaultProps
  });
  let reviewsApiRoutes = reviewsApi({
    config,
    reviewsModel,
    ...defaultProps
  });
  // let stripeApiRoutes = stripeService({
  //   config,
  //   userModel
  // });
  return {
    // chatApiRoutes,
    eventsApiRoutes,
    // stripeApiRoutes,
    productsApiRoutes,
    categoriesApiRoutes,
    cartsApiRoutes,
    ordersApiRoutes,
    reviewsApiRoutes
  };
};

module.exports = Api;
