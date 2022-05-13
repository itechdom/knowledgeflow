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
const locations = [{
    neighborhood: `Squirrel Hills`,
    businessName: `The Chocolate Moose`,
    googleBusinessPage: `https://goo.gl/maps/bitnFUxxQEb9nKQY8`,
    addressText: `5830 Forbes Ave, Pittsburgh, PA 15217`,
    lat: 40.4378,
    long: -79.9217
  },
  {
    neighborhood: `Greenfield`,
    businessName: `HQ`,
    addressText: `932 Mirror st. Pittsburgh PA 15217`,
    lat: 40.42663,
    long: -79.931566
  },
  {
    neighborhood: `Mt Lebanon`,
    businessName: `Olive & Rose Events`,
    googleBusinessPage: `https://goo.gl/maps/M9R7oDN3pw4PTjgJA`,
    addressText: `143 Beverly Rd, Pittsburgh, PA 15216`,
    lat: 40.39255,
    long: -80.046667
  },
  {
    neighborhood: `Sewickley`,
    businessName: `Adesso Cafe`,
    googleBusinessPage: `https://goo.gl/maps/ctkdGMMwfF73WqMX6`,
    addressText: `441 1/2 Walnut Street, Sewickley, PA 15143`,
    lat: 40.54112,
    long: -80.18186
  },
  {
    neighborhood: `Ross Township`,
    businessName: `The Tiny Bookstore`,
    googleBusinessPage: `https://g.page/tinybookspgh?share`,
    addressText: `1130 Perry Hwy Suite 106, Pittsburgh, PA 15237,`,
    lat: 40.547688,
    long: -80.03554
  },
  {
    neighborhood: `Butler`,
    businessName: `Lightning Hair Lounge`,
    googleBusinessPage: `https://g.page/Lightninghairlounge?share`,
    addressText: `456 Pittsburgh Rd, Butler, PA 16002`,
    lat: 40.774142,
    long: -79.928837
  },
  {
    neighborhood: `Brookline`,
    businessName: `Thrive on health`,
    googleBusinessPage: `https://goo.gl/maps/sn1q68JU5ZXUgfLQ9`,
    addressText: `730 Brookline Blvd, Pittsburgh, PA 15226`,
    lat: 40.394082,
    long: -80.020851
  },
  {
    neighborhood: `Strip District`,
    businessName: `Salems`,
    googleBusinessPage: `https://goo.gl/maps/4NiLtbCP7m9UFuCh6`,
    addressText: `2923 Penn Ave, Pittsburgh, PA 15201`,
    lat: 40.458475,
    long: -79.973756
  },
  {
    neighborhood: `Upper Lawrenceville`,
    businessName: `Spruce & Adorn (inside Ineffable)`,
    googleBusinessPage: `https://goo.gl/maps/WhAYWEBbxc835Qf37`,
    addressText: `3920 Penn Ave, Pittsburgh, PA 15224`,
    lat: 40.464654,
    long: -79.959291
  },
  {
    neighborhood: `Lower Lawrenceville`,
    businessName: `Hippie and French`,
    googleBusinessPage: `https://goo.gl/maps/kcLU6T5QRqa5nR868`,
    addressText: `5122 Butler St, Pittsburgh, PA 15201`,
    lat: 40.478912,
    long: -79.955084
  },
  {
    neighborhood: `East Liberty(ish)`,
    addressText: `East End coop: 7516 Meade St, Pittsburgh, PA 15208`,
    googleBusinessPage: `https://goo.gl/maps/nL5zBLipEzrLqEjn7`,
    lat: 40.462559,
    long: -79.92185
  },
  {
    neighborhood: `Bellevue`,
    businessName: "Guys and Dolls Salon",
    addressText: `555 Lincoln Ave, Bellevue, PA 15202`,
    googleBusinessPage: `https://goo.gl/maps/jGKCNERD7cwB2g6y9`,
    lat: 40.496287,
    long: -80.057551
  },
  {
    neighborhood: `Delmont`,
    businessName: "Station 7",
    addressText: `7 Greensburg Street, Delmont, Pennsylvania 15626	`,
    googleBusinessPage: `https://g.page/stationhouse7?share`,
    lat: 40.412888,
    long: -79.570507
  },
  {
    neighborhood: `Downtown`,
    businessName: "Bea Taco Town",
    addressText: `633 Smithfield St. Pittsburgh PA 15222`,
    googleBusinessPage: `https://goo.gl/maps/oMvd4bNS4CyqgYz16`,
    lat: 40.462559,
    long: -79.92185
  },
  {
    neighborhood: `Downtown`,
    businessName: "Bea Taco Town",
    addressText: `633 Smithfield St. Pittsburgh PA 15222`,
    googleBusinessPage: `https://goo.gl/maps/oMvd4bNS4CyqgYz16`,
    lat: 40.442408,
    long: -79.997255
  },
  {
    neighborhood: `North Side`,
    businessName: "Museum Lab",
    addressText: `6 Allegheny Square E Suite 101, Pittsburgh, PA 15212`,
    googleBusinessPage: `https://g.page/museumlab?share`,
    lat: 40.453079,
    long: -80.005190
  },
  {
    neighborhood: `Shadyside`,
    businessName: "Arriviste Coffee",
    addressText: `5730 Ellsworth Ave Pittsburgh, PA 15232	`,
    googleBusinessPage: `https://goo.gl/maps/c5FkvwrzroEZdHTs7`,
    lat: 40.455379,
    long: -79.931270
  },
  {
    neighborhood: `Wexford`,
    businessName: "Levana Bratique",
    addressText: `11530 Perry Hwy #106, Wexford, PA 15090`,
    googleBusinessPage: `https://g.page/LevanaBratique?share`,
    lat: 40.625228,
    long: -80.053766
  }
];
const Volunteerings = ({
  config,
  volunteeringsModel,
  permissionsModel,
  formsModel
}) => {
  let modelName = "volunteerings";
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
        criteria: {},
        populate: []
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
  const volunteeringsApi = crudService({
    Model: volunteeringsModel,
    crudDomainLogic
  });

  let vizDomainLogic = {
    average: (volunteerings, req, res) => {
      //this should return a criteria
      return { criteria: {} };
    },
    min: (volunteerings, req, res) => {
      return { criteria: {} };
    },
    max: (volunteerings, req, res) => {
      return { criteria: {} };
    },
    sum: (volunteerings, req, res) => {
      return { criteria: {} };
    },
    count: (volunteerings, req, res) => {
      return { criteria: {} };
    },
    distinct: (volunteerings, req, res) => {
      return { criteria: {} };
    }
  };
  const vizApi = vizService({
    Model: volunteeringsModel,
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
    modelName: "volunteerings",
    mediaDomainLogic,
    isMultiple: false,
    Model: volunteeringsModel,
    fileExtension: ".jpg"
  });

  const galleryUploadApi = mediaService({
    fileName: "avatar",
    modelName: "volunteerings",
    mediaDomainLogic,
    isMultiple: true,
    Model: volunteeringsModel,
    fileExtension: ".jpg"
  });

  //forms api
  let formsDomainLogic = {
    read: volunteerings => {
      return { criteria: { key: "volunteerings" }, isPermitted: true };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });

  //register actions to configure acls in the future (namespace is volunteerings here and it will register every action into a permissions table)
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
        name: "title",
        value: "",
        placeholder: "Event Title",
        required: false
      },
      {
        type: "text",
        name: "description",
        placeholder: "Description",
        value: "",
        required: false
      },
      {
        type: "date",
        name: "startDate",
        placeholder: "Start Date",
        value: Date.now(),
        required: false
      },
      {
        type: "text",
        name: "pickupLocationName",
        placeholder: "Pick up Label",
        required: false
      },
      {
        type: "ref",
        name: "pickup",
        placeholder: "Pick up location",
        required: false
      },
      {
        type: "text",
        name: "dropoffLocationName",
        placeholder: "Drop off Label",
        required: false
      },
      {
        type: "ref",
        name: "dropoff",
        placeholder: "Drop off location",
        required: false
      },
      {
        type: "number",
        name: "limit",
        placeholder: "RSVP limit",
        required: false
      },
      {
        type: "checkbox",
        name: "done",
        placeholder: "Event Done",
        required: false
      },
      {
        type: "object-array",
        name: "volunteers",
        placeholder: "Volunteers",
        form: {
          fields: [
            { type: "text", name: "name", placeholder: "Volunteer's Name" },
            { type: "email", name: "email", placeholder: "Email" }
          ]
        },
        required: false
      }
    ],
    formsModel
  });

  return [
    volunteeringsApi,
    previewImageUploadApi,
    galleryUploadApi,
    vizApi,
    formsApi
  ];
};

module.exports = Volunteerings;
module.exports.locations = locations;
