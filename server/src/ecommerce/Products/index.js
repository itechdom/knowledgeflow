//the crud service creates [create, read, update, del] endpoints for a mongoose model
const crudService = require("@markab.io/node/crud-service/crud-service")
const mediaService = require("@markab.io/node/media-service/media-service.js")
const vizService = require("@markab.io/node/viz-service/viz-service.js")
const {
  formsService,
  registerForms
} = require("@markab.io/node/forms-service/forms-service")
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js")

const Products = ({ config, productsModel, permissionsModel, formsModel, lambdaModel }) => {
  let modelName = "products";
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
        populate: ["categories"]
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
  const productsApi = crudService({ Model: productsModel, crudDomainLogic });

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
    Model: productsModel,
    domainLogic: vizDomainLogic
  });

  //file upload api
  let mediaDomainLogic = {
    getMedia: (user, req, res) => {
      return {
        criteria: {
          tag: user._id,
          token: user && user.jwtToken,
          query: { _id: req.query.query }
        },
        isPermitted: true
      };
    },
    saveMedia: (user, req, res) => {
      return {
        criteria: {
          token: user && user.jwtToken,
          query: { _id: req.query.query, fileName: req.query.fileName }
        },
        isPermitted: true
      };
    }
  };
  const fileUploadApi = mediaService({
    fileName: modelName,
    modelName: modelName,
    mediaDomainLogic,
    Model: productsModel,
    fileExtension: ".jpg"
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

  /* Zee:
    We are registering actions and forms here. There is something happening here that I don't see. 
    first we are registering a products with domain logic of crud. then we register the same products with domain logic media. 
    seems like we are saying what the products info could be; and the same for products media?
    Then we register the form >> does that mean we are registering the form model? 
 */

  //register actions to configure acls in the future (namespace is products here and it will register every action into a permissions table)
  // TODO call this registerDomainAction
  registerAction({
    key: modelName,
    domainLogic: crudDomainLogic,
    permissionsModel,
    defaultPermission: false
  });
  registerAction({
    key: modelName,
    domainLogic: mediaDomainLogic,
    permissionsModel
  });
  // TODO translate here
  // Intialize the form in the database when the server runs
  registerForms({
    key: modelName,
    fields: [
      {
        type: "image",
        name: "image",
        placeholder: "Preview Image"
      },
      {
        type: "gallery",
        name: "gallery",
        placeholder: "Product Images"
      },
      {
        type: "text",
        name: "title",
        placeholder: "Product Title",
        value: "",
        required: true
      },
      {
        type: "text",
        name: "description",
        placeholder: "Description",
        value: "",
        required: true
      },
      {
        type: "number",
        name: "price",
        placeholder: "Price",
        required: true
      },
      {
        type: "array",
        name: "sizes",
        placeholder: "Product Sizes"
      },
      {
        type: "gallery-with-title",
        name: "colors",
        placeholder: "Product Colors"
      },
      {
        type: "ref",
        name: "categories",
        placeholder: "Categories"
      }
    ],
    formsModel
  });
  return [productsApi, fileUploadApi, vizApi, formsApi];
};

module.exports =  Products;
