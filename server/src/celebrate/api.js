const mongoose = require("mongoose");
const celebratesSchema = require("../../../../orbital-api-pro/MongoDb/models/celebrate");
const celebratesModel = mongoose.model("Celebrate", celebratesSchema);
const celebratesApi = require("./Celebrate");

//api
const Api = ({
  config,
  kernelModel,
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
    notificationsModel,
    config
  };
  let celebratesApiRoutes = celebratesApi({
    celebratesModel,
    ...defaultProps
  });
  return {
    celebratesApiRoutes
  };
};

module.exports = Api;
