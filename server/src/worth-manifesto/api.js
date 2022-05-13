const mongoose = require("mongoose");
const volunteeringSchema = require("../../../../orbital-api-pro/MongoDb/models/volunteering");
const volunteeringsModel = mongoose.model("Volunteering", volunteeringSchema);
const volunteeringsApi = require("./Volunteering");
const locationsSchema = require("../../../../orbital-api/MongoDb/models/locations");
const locationsModel = mongoose.model("Location", locationsSchema);
const locationsApi = require("./Location");
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
  let volunteeringsApiRoutes = volunteeringsApi({
    volunteeringsModel,
    ...defaultProps
  });
  let locationsApiRoutes = locationsApi({
    locationsModel,
    ...defaultProps
  })
  return {
    volunteeringsApiRoutes,
    locationsApiRoutes
  };
};

module.exports = Api;
