//the crud service creates [create, read, update, del] endpoints for a mongoose model
const crudService = require("@markab.io/node/crud-service/crud-service");
const mediaService = require("@markab.io/node/media-service/media-service.js");
const vizService = require("@markab.io/node/viz-service/viz-service.js");
const {
  notificationService
} = require("@markab.io/node/notification-service/notification-service");
const {
  formsService,
  registerForms
} = require("@markab.io/node/forms-service/forms-service");
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js");

const Blogs = ({
  config,
  blogsModel,
  permissionsModel,
  formsModel,
  notificationsModel,
  server
}) => {
  let modelName = "blogs";
  // const { apiRoutes: notificationApi, afterSocketInit } = notificationService({
  //   modelName,
  //   server,
  //   config
  // });
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
        populate: []
        // onResponse: (data, req, res) => {
        //   // publish({
        //   //   modelName,
        //   //   message: "user is reading!"
        //   // });
        //   afterSocketInit.then(socket => {
        //     socket.emit(
        //       "helooooooooooooooooo, you are reading a blog, make sure to check out ..."
        //     );
        //     res.send(data);
        //   });
        // }
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_update`, user }),
        criteria: {},
        onResponse: (data, req, res) => {
          afterSocketInit.then(({ io, socket }) => {
            io.emit("notification", "Someone just edited this blog");
            const notification = new notificationsModel({
              title: "someone just edited this blog",
              type: "warning",
              modelId: `${modelName}`
            });
            notification.save();
          });
          res.send(data);
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
  const blogsApi = crudService({ Model: blogsModel, crudDomainLogic });

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
  const vizApi = vizService({ Model: blogsModel, domainLogic: vizDomainLogic });

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
    fileName: "blogs",
    modelName,
    mediaDomainLogic,
    Model: blogsModel,
    fileExtension: ".jpg"
  });

  //forms api
  let formsDomainLogic = {
    read: blog => {
      return { criteria: { key: `${modelName}` }, isPermitted: true };
    }
  };
  const formsApi = formsService({
    Model: formsModel,
    formsDomainLogic
  });

  /* Zee:
    We are registering actions and forms here. There is something happening here that I don't see. 
    first we are registering a blog with domain logic of crud. then we register the same blog with domain logic media. 
    seems like we are saying what the blog info could be; and the same for blog media?
    Then we register the form >> does that mean we are registering the form model? 
 */

  //register actions to configure acls in the future (namespace is blog here and it will register every action into a permissions table)
  // TODO call this registerDomainAction
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
        name: "image",
        placeholder: "Preview Image Url"
      },
      {
        type: "text",
        name: "title",
        placeholder: "Blog Title",
        value: "",
        required: true
      },
      {
        type: "text",
        name: "description",
        placeholder: "Blog Description",
        value: "",
        required: false
      },
      {
        type: "markdown",
        name: "body",
        placeholder: "Body",
        value: "",
        required: true
      },
      {
        type: "select",
        name: "status",
        placeholder: "Status",
        options: ["Publish", "Draft"],
        required: true
      },
      {
        type: "array",
        name: "tags",
        placeholder: "Tags",
        value: []
      },
      {
        type: "object-array",
        form: {
          fields: [
            { type: "uuid", name: "_id", placeholder: "Auto-generated-id" },
            { type: "text", name: "title", placeholder: "Title" },
            { type: "text", name: "name", placeholder: "Commenter's Name" },
            { type: "text", name: "parent", placeholder: "Parent" },
            { type: "array", name: "children", placeholder: "Children" }
          ]
        },
        name: "comments",
        placeholder: "Comments",
        value: []
      }
    ],
    formsModel
  });

  return [blogsApi, fileUploadApi, vizApi, formsApi];
};

module.exports = Blogs;
