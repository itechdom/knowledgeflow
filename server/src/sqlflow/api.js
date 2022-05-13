const sqlflowModel = require("./SqlFlow/sqlflow.model");
const sqlflowApi = require("./SqlFlow");

const Api = ({
  config,
  settingsModel,
  formsModel,
  permissionsModel,
  kernelModel,
  notificationsModel
}) => {
  const defaultProps = {
    kernelModel,
    permissionsModel,
    settingsModel,
    formsModel,
    notificationsModel
  };
  let sqlflowApiRoutes = sqlflowApi({
    config,
    sqlflowModel,
    ...defaultProps
  });
  return {
    sqlflowApiRoutes
  };
};

module.exports = Api;
