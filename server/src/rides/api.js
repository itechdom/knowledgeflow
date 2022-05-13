const rideLogModel = require("@markab.io/orbital-api/MongoDb/models/ride-log");
const ridesApi = require("./Ride");

//api
const Api = ({
  app,
  config,
  kernelModel,
  userModel,
  settingsModel,
  permissionsModel,
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
  let ridesApiRoutes = ridesApi({
    app,
    config,
    userModel,
    rideLogModel,
    ...defaultProps
  });
  return {
    ridesApiRoutes
  };
};

module.exports = Api;
