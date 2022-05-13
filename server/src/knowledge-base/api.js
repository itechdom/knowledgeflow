const knowledgeModel = require("@markab.io/orbital-api/MongoDb/models/knowledge");
const knowledgeApi = require("./Knowledge");
const lambdaModel = require("@markab.io/orbital-api/MongoDb/models/lambda");

const Api = ({
  config,
  userModel,
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
    notificationsModel,
    lambdaModel,
  };
  let knowledgeApiRoutes = knowledgeApi({
    config,
    knowledgeModel,
    ...defaultProps,
  });
  return {
    knowledgeApiRoutes,
  };
};

module.exports = Api;
