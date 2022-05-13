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

const Events = ({ config, eventsModel, permissionsModel, formsModel }) => {
  let modelName = "events";
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
  const eventsApi = crudService({ Model: eventsModel, crudDomainLogic });

  let vizDomainLogic = {
    average: (events, req, res) => {
      //this should return a criteria
      return { criteria: {} };
    },
    min: (events, req, res) => {
      return { criteria: {} };
    },
    max: (events, req, res) => {
      return { criteria: {} };
    },
    sum: (events, req, res) => {
      return { criteria: {} };
    },
    count: (events, req, res) => {
      return { criteria: {} };
    },
    distinct: (events, req, res) => {
      return { criteria: {} };
    }
  };
  const vizApi = vizService({
    Model: eventsModel,
    domainLogic: vizDomainLogic
  });

  //file upload api
  let mediaDomainLogic = {
    getMedia: (events, req, res) => {
      return {
        criteria: {
          tag: events._id,
          token: events.jwtToken,
          query: { _id: events._id }
        },
        isPermitted: true
      };
    },
    saveMedia: (events, req, res) => {
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
    modelName: "events",
    mediaDomainLogic,
    isMultiple: false,
    Model: eventsModel,
    fileExtension: ".jpg"
  });

  const galleryUploadApi = mediaService({
    fileName: "avatar",
    modelName: "events",
    mediaDomainLogic,
    isMultiple: true,
    Model: eventsModel,
    fileExtension: ".jpg"
  });

  //forms api
  let formsDomainLogic = {
    read: events => {
      return { criteria: { key: "events" }, isPermitted: true };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });

  //register actions to configure acls in the future (namespace is events here and it will register every action into a permissions table)
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

  return [eventsApi, previewImageUploadApi, galleryUploadApi, vizApi, formsApi];
};

module.exports =  Events;
