const users = require("./seeds/users");
const blogs = require("./seeds/blogs");
const events = require("./seeds/events");
const settings = require("./seeds/settings");
const products = require("./seeds/products");
const categories = require("./seeds/categories");

const userModel = require("./models/user");
const cartsModel = require("./models/carts");
const ordersModel = require("./models/orders");
const chatLogModel = require("./models/chat-log");
const blogModel = require("./models/blog");
const productsModel = require("./models/products");
const settingsModel = require("./models/settings");
const eventsModel = require("./models/events");
const categoriesModel = require("./models/categories");
const mongoose = require("mongoose");
const config = require("config");

mongoose
  .connect(`${config.get("db.host")}`, {
    dbName: "orbital"
  })
  .then(models => {
    console.log("connected to db");
  })
  .catch(err => {
    if (err) return console.error(err);
  }); // connect to database

async function seed(Model, seedData) {
  let removed = await Model.remove({ isASeed: true });
  await Promise.all(
    seedData.map(async d => {
      let data = new Model(d);
      let savedData = await data.save();
      console.log("saved data", savedData);
      return savedData;
    })
  );
}

async function seedCartsOrOrders(Model) {
  //find a user and 3 products
  await Model.remove({ isASeed: true });
  let user = await userModel.findOne({ name: "Test Name 1" });
  let products = await productsModel.find({ isASeed: true });
  let order = new Model({
    user: user._id,
    products: products.map(({ _id }) => _id),
    isASeed: true
  });
  let savedOrder = await order.save();
}

async function runSeeds() {
  await seed(blogModel, blogs);
  await seed(settingsModel, settings);
  await seed(eventsModel, events);
  await seed(productsModel, products);
  await seed(userModel, users);
  await seed(categoriesModel, categories);
  await seedCartsOrOrders(cartsModel);
  await seedCartsOrOrders(ordersModel);
  process.exit(0);
}

runSeeds();
