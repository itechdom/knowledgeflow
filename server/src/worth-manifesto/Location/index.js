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
const googlePlaceSearch = require("./googlePlaceSearch.js");

const formatLocations = (response, query) => {
  return response.results.map(rs => {
    return {
      businessName: query.name,
      addressText: rs.formatted_address,
      lat: rs.geometry.location.lat,
      long: rs.geometry.location.lng
    }
  })
}

const Locations = ({
  config,
  locationsModel,
  permissionsModel,
  formsModel
}) => {
  let modelName = "locations";
  let crudDomainLogic = {
    //lock creation api only to admins
    create: (user, req) => {
      let model = req.body.model;
      return {
        isPermitted: user && user.isAdmin ? true : false,
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
        criteria: {},
        onResponse: (results, req, res) => {
          if (results.length === 0) {
            return googlePlaceSearch.findPlace(req.body.query).then(response => {
              return res.status(200).send(formatLocations(response, req.body.query));
            }).catch(err => {
              console.error("ERR", err)
            })
          }
          return res.status(200).send(results)
        }
      };
    }
  };
  const locationsApi = crudService({
    Model: locationsModel,
    crudDomainLogic
  });

  let vizDomainLogic = {
    average: (locations, req, res) => {
      //this should return a criteria
      return { criteria: {} };
    },
    min: (locations, req, res) => {
      return { criteria: {} };
    },
    max: (locations, req, res) => {
      return { criteria: {} };
    },
    sum: (locations, req, res) => {
      return { criteria: {} };
    },
    count: (locations, req, res) => {
      return { criteria: {} };
    },
    distinct: (locations, req, res) => {
      return { criteria: {} };
    }
  };
  const vizApi = vizService({
    Model: locationsModel,
    domainLogic: vizDomainLogic
  });

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
  const previewImageUploadApi = mediaService({
    fileName: "avatar",
    modelName: "locations",
    mediaDomainLogic,
    isMultiple: false,
    Model: locationsModel,
    fileExtension: ".jpg"
  });

  const galleryUploadApi = mediaService({
    fileName: "avatar",
    modelName: "locations",
    mediaDomainLogic,
    isMultiple: true,
    Model: locationsModel,
    fileExtension: ".jpg"
  });

  //forms api
  let formsDomainLogic = {
    read: locations => {
      return { criteria: { key: "locations" }, isPermitted: true };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });

  //register actions to configure acls in the future (namespace is locations here and it will register every action into a permissions table)
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
    fields: [{
        type: "text",
        name: "businessName",
        value: "",
        placeholder: "Business name",
        required: false
      },
      {
        type: "text",
        name: "addressText",
        placeholder: "Address",
        value: "",
        required: false
      }
    ],
    formsModel
  });

  return [
    locationsApi,
    previewImageUploadApi,
    galleryUploadApi,
    vizApi,
    formsApi
  ];
};

module.exports = Locations;
