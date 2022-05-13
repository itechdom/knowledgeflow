const chatLogModel = require("@markab.io/orbital-api/MongoDb/models/chat-log");
const chatApi = require("./Chat");

//api
const Api = ({
  app,
  config,
  kernelModel,
  userModel,
  settingsModel,
  permissionsModel,
  formsModel,
  notificationsModel,
  server
}) => {
  let chatApiRoutes = chatApi({
    app,
    config,
    userModel,
    chatLogModel,
    permissionsModel,
    formsModel,
    server
  });
  return {
    chatApiRoutes
  };
};

module.exports = Api;
