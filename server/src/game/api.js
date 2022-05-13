const gameLogModel = require("@markab.io/orbital-api/MongoDb/models/game-log");
const gameApi = require("./Game");

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
  const defaultProps = {
    kernelModel,
    permissionsModel,
    settingsModel,
    formsModel,
    notificationsModel
  };
  let gameApiRoutes = gameApi({
    app,
    config,
    userModel,
    gameLogModel,
    server,
    ...defaultProps
  });
  return {
    gameApiRoutes
  };
};

module.exports = Api;
