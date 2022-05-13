//the crud service creates [create, read, update, del] endpoints for a mongoose model
const crudService = require("@markab.io/node/crud-service/crud-service");
const vizService = require("@markab.io/node/viz-service/viz-service.js");
const {
  formsService
} = require("@markab.io/node/forms-service/forms-service");
const {
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js");

const Contacts = ({ contactsModel, formsModel }) => {
  let modelName = "contacts";
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
      return {
        criteria: { key: `${modelName}` },
        isPermitted: true,
        onResponse: (data, req, res) => {
          res.send(data);
        }
      };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });

  return [contactsApi, vizApi, formsApi];
};

module.exports = Contacts;
