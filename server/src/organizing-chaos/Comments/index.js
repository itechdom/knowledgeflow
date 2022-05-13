//the crud service creates [create, read, update, del] endpoints for a mongoose model
const crudService = require("@markab.io/node/crud-service/crud-service")
const vizService = require("@markab.io/node/viz-service/viz-service.js")
const {
  formsService,
  registerForms
} = require("@markab.io/node/forms-service/forms-service")
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js")
const Comments = ({
  config,
  commentsModel,
  permissionsModel,
  formsModel
}) => {
  let modelName = "comments";
  let crudDomainLogic = {
    create: (user, req) => {
      //we need to include is permitted in here
      return {
        isPermitted: isPermitted({ key: `${modelName}_create`, user }),
        criteria: {}
      };
    },
    read: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_read`, user }),
        criteria: {},
        populate: ["parent","children"]
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
  const commentsApi = crudService({
    Model: commentsModel,
    crudDomainLogic
  });

  /* Zee:
    what is this for? 
 */
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
    Model: commentsModel,
    domainLogic: vizDomainLogic
  });

  //forms api
  let formsDomainLogic = {
    read: user => {
      return { criteria: { key: modelName }, isPermitted: true };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });

  registerAction({
    key: modelName,
    domainLogic: crudDomainLogic,
    permissionsModel,
    defaultPermission: false
  });
  registerForms({
    key: modelName,
    fields: [
      {
        type: "text",
        name: "title",
        placeholder: "Title"
      },
      {
        type: "text",
        name: "name",
        placeholder: "Your name"
      }
    ],
    formsModel
  });
  return [commentsApi, vizApi, formsApi];
};

module.exports =  Comments;
