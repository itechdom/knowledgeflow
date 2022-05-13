//the crud service creates [create, read, update, del] endpoints for a mongoose model
const crudService = require("@markab.io/node/crud-service/crud-service");
const vizService = require("@markab.io/node/viz-service/viz-service.js");
const {
  formsService,
  registerForms
} = require("@markab.io/node/forms-service/forms-service");
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js");
const {
  registerLambdaFunction
} = require("@markab.io/node/lambda-service/lambda-service.js");

const Contacts = ({
  contactsModel,
  lambdaModel,
  permissionsModel,
  formsModel
}) => {
  let modelName = "contacts";
  let path = "src/OrbitalSite/";
  registerLambdaFunction({ modelname: modelName, path, lambdaModel });
  let crudDomainLogic = {
    create: (user, req) => {
      //we need to include is permitted in here
      return {
        isPermitted: isPermitted({ key: `${modelName}_create`, user }),
        criteria: {}
      };
    },
    read: (user, req) => {
      //we need to include is permitted in here
      return {
        isPermitted: isPermitted({ key: `${modelName}_read`, user }),
        criteria: {}
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_update`, user }),
        criteria: {},
        onResponse: (updatedContacts, req, res) => {
          res.status(200).send(updatedContacts);
        }
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
  const contactsApi = crudService({ Model: contactsModel, crudDomainLogic });

  /* Zee:
    what is this for? 
 */
  let vizDomainLogic = {
    average: (user, req, res) => {
      //this should return a criteria
      return { criteria: {} };
    },
    min: (user, req, res) => {
      return { criteria: {} };
    },
    max: (user, req, res) => {
      return { criteria: {} };
    },
    sum: (user, req, res) => {
      return { criteria: {} };
    },
    count: (user, req, res) => {
      return { criteria: {} };
    },
    distinct: (user, req, res) => {
      return { criteria: {} };
    }
  };
  const vizApi = vizService({
    Model: contactsModel,
    domainLogic: vizDomainLogic
  });

  //forms api
  let formsDomainLogic = {
    read: user => {
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
  registerForms({
    key: `${modelName}`,
    fields: [
      {
        type: "text",
        name: "name",
        placeholder: "Name",
        value: "",
        required: true
      },
      {
        type: "email",
        name: "email",
        placeholder: "Email",
        value: "",
        required: true
      },
      {
        type: "text",
        name: "message",
        placeholder: "Message",
        value: "",
        required: true
      }
    ],
    formsModel
  });

  return [contactsApi, vizApi, formsApi];
};

module.exports = Contacts;
