//the crud service creates [create, read, update, del] endpoints for a mongoose model
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
const Prototype = ({
  config,
  prototypeModel,
  permissionsModel,
  formsModel
}) => {
  prototypeModel.find({}, (err, data) => {
    console.log("data", data);
  });
  let modelName = "prototype";
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
  const prototypeApi = crudService({ Model: prototypeModel, crudDomainLogic });

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
    Model: prototypeModel,
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
    fileName: "prototype",
    modelName,
    mediaDomainLogic,
    Model: prototypeModel,
    fileExtension: ".jpg"
  });

  //forms api
  let formsDomainLogic = {
    read: prototype => {
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
        placeholder: "Prototype Title",
        value: "",
        required: true
      },
      {
        type: "array",
        name: "tags",
        placeholder: "Tags",
        value: [],
        required: false
      }
    ],
    formsModel
  });

  return [prototypeApi, fileUploadApi, vizApi, formsApi];
};

module.exports = Prototype;