//the crud service creates [create, read, update, del] endpoints for a mongoose model
const crudService = require("@markab.io/node/crud-service/crud-service");
const mediaService = require("@markab.io/node/media-service/media-service");
const vizService = require("@markab.io/node/viz-service/viz-service");
const {
  formsService,
  registerForms,
} = require("@markab.io/node/forms-service/forms-service");
const {
  registerAction,
  isPermitted,
} = require("@markab.io/node/acl-service/acl-service");
const {
  registerLambdaFunction,
} = require("@markab.io/node/lambda-service/lambda-service");
const Knowledge = ({
  config,
  knowledgeModel,
  permissionsModel,
  lambdaModel,
  formsModel,
}) => {
  let modelName = "knowledge";
  let path = "src/knowledge-base/";
  registerLambdaFunction({ modelname: modelName, path, lambdaModel });
  let crudDomainLogic = {
    create: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_create`, user }),
        criteria: {},
      };
    },
    read: (user, req) => {
      console.log("req", req.query);
      return {
        isPermitted: isPermitted({ key: `${modelName}_read`, user }),
        criteria: {
          query: req.query && req.query.query && JSON.parse(req.query.query),
        },
        exclude:
          req.query && req.query.query && JSON.parse(req.query.query)._id
            ? []
            : ["body"],
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_update`, user }),
        criteria: {},
      };
    },
    del: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_delete`, user }),
        criteria: {},
      };
    },
    search: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_search`, user }),
        criteria: {},
        onResponse: (data, req, res) => {
          let formattedData = data.map((d) => {
            return { _id: d._id, title: d.title };
          });
          return res
            .status(200)
            .send({ data: formattedData, count: formattedData.length });
        },
      };
    },
  };
  const knowledgeApi = crudService({ Model: knowledgeModel, crudDomainLogic });

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
    },
  };
  const vizApi = vizService({
    Model: knowledgeModel,
    domainLogic: vizDomainLogic,
  });

  //file upload api
  let mediaDomainLogic = {
    getMedia: (user, req, res) => {
      return {
        criteria: {
          tag: user._id,
          token: user.jwtToken,
          query: { _id: req.query.query },
        },
        isPermitted: true,
      };
    },
    saveMedia: (user, req, res) => {
      return {
        criteria: {
          token: user.jwtToken,
          query: { _id: req.query.query, fileName: req.query.fileName },
        },
        isPermitted: true,
      };
    },
  };
  const fileUploadApi = mediaService({
    fileName: "knowledge",
    modelName,
    mediaDomainLogic,
    Model: knowledgeModel,
    fileExtension: ".jpg",
  });

  //forms api
  let formsDomainLogic = {
    read: (knowledge) => {
      return { criteria: { key: `${modelName}` }, isPermitted: true };
    },
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic,
  });
  registerAction({
    key: `${modelName}`,
    domainLogic: crudDomainLogic,
    permissionsModel,
    defaultPermission: false,
  });
  registerAction({
    key: `${modelName}`,
    domainLogic: mediaDomainLogic,
    permissionsModel,
  });
  registerForms({
    key: `${modelName}`,
    fields: [
      {
        type: "text",
        name: "title",
        placeholder: "Knowledge Title",
        value: "",
        required: true,
      },
      {
        type: "array",
        name: "tags",
        placeholder: "Tags",
        value: [],
        required: false,
      },
    ],
    formsModel,
  });

  return [knowledgeApi, fileUploadApi, vizApi, formsApi];
};

module.exports = Knowledge;
