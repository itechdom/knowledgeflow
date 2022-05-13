//the crud service creates [create, read, update, del] endpoints for a mongoose model
const crudService = require("@markab.io/node/crud-service/crud-service")
const mediaService = require("@markab.io/node/media-service/media-service.js")
const {
  formsService,
  registerForms
} = require("@markab.io/node/forms-service/forms-service")
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js.js")

const Settings = ({ config, settingsModel, permissionsModel, formsModel }) => {
  let crudDomainLogic = {
    create: (user, req) => {
      //we need to include is permitted in here
      return {
        isPermitted: isPermitted({ key: "settings_create", user }),
        criteria: {}
      };
    },
    read: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "settings_read", user }),
        criteria: {}
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "settings_update", user }),
        criteria: {}
      };
    },
    del: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "settings_delete", user }),
        criteria: {}
      };
    },
    search: (user, req) => {
      return {
        isPermitted: isPermitted({ key: "settings_search", user }),
        criteria: {}
      };
    }
  };
  const settingsApi = crudService({ Model: settingsModel, crudDomainLogic });

  //file upload api
  let mediaDomainLogic = {
    getMedia: (user, req, res) => {
      return {
        criteria: {
          tag: user._id,
          token: user.jwtToken,
          query: { _id: user._id }
        },
        isPermitted: true
      };
    },
    saveMedia: (user, req, res) => {
      return {
        criteria: {
          tag: user._id,
          token: user.jwtToken,
          query: { _id: user._id }
        },
        isPermitted: true
      };
    }
  };
  const fileUploadApi = mediaService({
    fileName: "logo",
    modelName: "settings",
    mediaDomainLogic,
    isMultiple: false,
    Model: settingsModel,
    fileExtension: ".jpg"
  });

  //forms api
  let formsDomainLogic = {
    read: user => {
      return { criteria: { key: "settings" }, isPermitted: true };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });

  //register actions to configure acls in the future (namespace is user here and it will register every action into a permissions table)
  // TODO call this registerDomainAction
  registerAction({
    key: "settings",
    domainLogic: crudDomainLogic,
    permissionsModel,
    defaultPermission: false
  });
  registerAction({
    key: "settings",
    domainLogic: mediaDomainLogic,
    permissionsModel
  });
  // TODO translate here
  // Intialize the form in the database when the server runs
  registerForms({
    key: "settings",
    fields: [
      {
        type: "image",
        name: "image",
        placeholder: "Site Logo"
      },
      {
        type: "gallery",
        name: "gallery",
        placeholder: "Site Images"
      },
      {
        type: "text",
        name: "title",
        placeholder: "Site Title",
        value: "",
        required: true
      },
      {
        type: "text",
        name: "serverLocation",
        placeholder: "Server Location",
        value: "",
        required: true
      }
    ],
    formsModel
  });

  return [settingsApi, fileUploadApi, formsApi];
};

module.exports =  Settings;
