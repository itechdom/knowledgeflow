const mongoose = require("mongoose");
const prototypeScheme = require("../../../../orbital-api-pro/MongoDb/models/prototype");
const prototypeModel = mongoose.model("Prototype", prototypeScheme);
const prototypeApi = require("./Prototype");
const orbitalApi = require("@markab.io/orbital-api");
const {
  getExpressApp,
  getAllApis,
  registerAllRoutes
} = require("../../server");
const config = require("config");
const Api = () => {
  const { server, app } = getExpressApp(config);
  const exceptions = {
    disableChat: true,
    disableRides: true,
    disableNotifications: true
  };
  const {
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    chatApiRoutes,
    kernelApiRoutes,
    notificationsApiRoutes,
    productsApiRoutes,
    categoriesApiRoutes,
    cartsApiRoutes,
    ordersApiRoutes,
    knowledgeApiRoutes,
    ridesApiRoutes,
    gameApiRoutes,
    contactApiRoutes,
    sqlflowApiRoutes,
    blogsApiRoutes,
    eventsApiRoutes,
    ...defaultProps
  } = getAllApis({ server, app, exceptions });
  let prototypeApiRoutes = prototypeApi({
    config,
    prototypeModel,
    ...defaultProps
  });
  let orbitalApiRoutes = orbitalApi({
    config,
    ...defaultProps
  });
  app.use("/prototype", ...prototypeApiRoutes);
  registerAllRoutes({
    app,
    server,
    exceptions,
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    chatApiRoutes,
    kernelApiRoutes,
    notificationsApiRoutes,
    productsApiRoutes,
    categoriesApiRoutes,
    cartsApiRoutes,
    ordersApiRoutes,
    knowledgeApiRoutes,
    ridesApiRoutes,
    gameApiRoutes,
    contactApiRoutes,
    sqlflowApiRoutes,
    blogsApiRoutes,
    eventsApiRoutes,
    ...defaultProps
  });
  // app.use("/", ...orbitalApiRoutes);
  return {
    prototypeApiRoutes,
    ...orbitalApiRoutes
  };
};
module.exports = Api;
