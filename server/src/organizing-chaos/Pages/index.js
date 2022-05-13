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

const Pages = ({ config, pagesModel, permissionsModel, formsModel }) => {
  let modelName = "pages";
  let crudDomainLogic = {
    create: (user, req) => {
      let model = req.body.model;
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
  const pagesApi = crudService({ Model: pagesModel, crudDomainLogic });

  let vizDomainLogic = {
    average: (pages, req, res) => {
      //this should return a criteria
      return { criteria: {} };
    },
    min: (pages, req, res) => {
      return { criteria: {} };
    },
    max: (pages, req, res) => {
      return { criteria: {} };
    },
    sum: (pages, req, res) => {
      return { criteria: {} };
    },
    count: (pages, req, res) => {
      return { criteria: {} };
    },
    distinct: (pages, req, res) => {
      return { criteria: {} };
    }
  };
  const vizApi = vizService({
    Model: pagesModel,
    domainLogic: vizDomainLogic
  });

  //file upload api
  let mediaDomainLogic = {
    getMedia: (pages, req, res) => {
      return {
        criteria: {
          tag: pages._id,
          token: pages.jwtToken,
          query: { _id: pages._id }
        },
        isPermitted: true
      };
    },
    saveMedia: (pages, req, res) => {
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
  const previewImageUploadApi = mediaService({
    fileName: "avatar",
    modelName: "pages",
    mediaDomainLogic,
    isMultiple: false,
    Model: pagesModel,
    fileExtension: ".jpg"
  });

  const galleryUploadApi = mediaService({
    fileName: "avatar",
    modelName: "pages",
    mediaDomainLogic,
    isMultiple: true,
    Model: pagesModel,
    fileExtension: ".jpg"
  });

  //forms api
  let formsDomainLogic = {
    read: pages => {
      return { criteria: { key: "pages" }, isPermitted: true };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });

  //register actions to configure acls in the future (namespace is pages here and it will register every action into a permissions table)
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

  registerForms({
    key: modelName,
    fields: [
      {
        type: "image",
        name: "image",
        placeholder: "Event Preview image",
        value: ""
      },
      {
        type: "gallery",
        name: "gallery",
        placeholder: "Event Gallery",
        value: ""
      },
      {
        type: "text",
        name: "title",
        value: "",
        placeholder: "Event Title",
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
        type: "checkbox",
        name: "allDay",
        placeholder: "Is this event all day?",
        value: false,
        required: false
      },
      {
        type: "datetime",
        name: "startDateTime",
        placeholder: "Start Date and Time",
        value: Date.now(),
        required: true
      },
      {
        type: "datetime",
        name: "endDateTime",
        placeholder: "End Date and Time",
        value: Date.now(),
        required: false
      },
      {
        type: "checkbox",
        name: "isRecurring",
        placeholder: "Does this event recur?",
        value: false
      },
      {
        type: "select",
        name: "recurringRule",
        placeholder: "How often does this event recur?",
        options: ["YEARLY", "MONTHLY", "WEEKLY", "DAILY"],
        visibleWhen: "isRecurring",
        required: false
      },
      {
        type: "text",
        name: "lat",
        placeholder: "Latitude",
        value: "",
        required: false
      },
      {
        type: "text",
        name: "long",
        placeholder: "Longitude",
        value: "",
        required: false
      }
    ],
    formsModel
  });

  return [pagesApi, previewImageUploadApi, galleryUploadApi, vizApi, formsApi];
};

module.exports =  Pages;
