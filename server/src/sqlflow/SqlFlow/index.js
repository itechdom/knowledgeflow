//the crud service creates [create, read, update, del] endpoints for a mongoose model
const path = require("path");
const crudService = require("@markab.io/node/crud-service/crud-service");
const mediaService = require("@markab.io/node/media-service/media-service.js");
const vizService = require("@markab.io/node/viz-service/viz-service.js");
const {
  formsService,
  registerForms
} = require("@markab.io/node/forms-service/forms-service");
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js");
const sqlService = require("../node-services-pro/sql-service/sql-service");
const SqlFlow = ({ config, sqlflowModel, permissionsModel, formsModel }) => {
  const ourConfigDir = path.join(__dirname, "config");
  const baseConfig = config.util.loadFileConfigs(ourConfigDir);
  const newConfig = config.util.extendDeep(baseConfig, {
    auth: { google: { clientId: "nooos" } }
  });
  console.log(baseConfig, "hello");
  let modelName = "sqlflow";
  let crudDomainLogic = {
    create: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_create`, user }),
        criteria: {}
      };
    },
    read: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_read`, user }),
        criteria: {}
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_update`, user }),
        criteria: {}
      };
    },
    del: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_delete`, user }),
        criteria: {}
      };
    },
    search: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_search`, user }),
        criteria: {}
      };
    }
  };
  const sqlflowApi = crudService({ Model: sqlflowModel, crudDomainLogic });

  let vizDomainLogic = {
    average: (user, req, res) => {
      //this should return a criteria
      return {};
    },
    min: (user, req, res) => {
      return {};
    },
    max: (user, req, res) => {
      return {};
    },
    sum: (user, req, res) => {
      return {};
    },
    count: (user, req, res) => {
      return {};
    },
    distinct: (user, req, res) => {
      return {};
    }
  };
  const vizApi = vizService({
    Model: sqlflowModel,
    domainLogic: vizDomainLogic
  });

  //file upload api
  let mediaDomainLogic = {
    getMedia: (user, req, res) => {
      return {
        criteria: {
          tag: user._id,
          token: user.jwtToken,
          query: { _id: req.query.query }
        },
        isPermitted: true
      };
    },
    saveMedia: (user, req, res) => {
      return {
        criteria: {
          token: user.jwtToken,
          query: { _id: req.query.query, fileName: req.query.fileName }
        },
        isPermitted: true
      };
    }
  };
  const fileUploadApi = mediaService({
    fileName: "sqlflow",
    modelName,
    mediaDomainLogic,
    Model: sqlflowModel,
    fileExtension: ".jpg"
  });

  //forms api
  let formsDomainLogic = {
    read: sqlflow => {
      return { criteria: { key: `${modelName}` }, isPermitted: true };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });
  registerAction({
    key: `${modelName}`,
    domainLogic: crudDomainLogic,
    permissionsModel,
    defaultPermission: false
  });
  registerAction({
    key: `${modelName}`,
    domainLogic: mediaDomainLogic,
    permissionsModel
  });
  registerForms({
    key: `${modelName}`,
    fields: [
      {
        type: "text",
        name: "title",
        placeholder: "Flow Title",
        value: "",
        required: true
      },
      {
        type: "object-array",
        form: {
          fields: [
            { type: "text", name: "title", placeholder: "Title" },
            {
              type: "code-editor",
              language: "sql",
              name: "sql",
              placeholder: "Sql statement"
            }
          ]
        },
        name: "statements",
        placeholder: "SQL Statements",
        value: []
      }
    ],
    formsModel
  });
  const sqlApi = sqlService({
    execute: (user, req, res) => {
      return {
        isPermitted: true,
        onResponse: (data, req, res) => {
          res.send(data);
        }
      };
    },
    config
  });
  return [sqlflowApi, fileUploadApi, vizApi, formsApi, sqlApi];
};

module.exports = SqlFlow;
