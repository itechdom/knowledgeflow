//the crud service creates [create, read, update, del] endpoints for a mongoose model
const crudService = require("@markab.io/node/crud-service/crud-service");
const mediaService = require("@markab.io/node/media-service/media-service.js");
const { sendEmail } = require("@markab.io/node/email-service/email-service");
const vizService = require("@markab.io/node/viz-service/viz-service");
const {
  formsService,
  registerForms
} = require("@markab.io/node/forms-service/forms-service");
const {
  registerAction,
  isPermitted
} = require("@markab.io/node/acl-service/acl-service.js");
const { onPasswordReset } = require("./on-password-reset");

const User = ({ config, userModel, permissionsModel, formsModel }) => {
  let modelName = "users";
  let crudDomainLogic = {
    create: (user, req) => {
      //we need to include is permitted in here
      return {
        isPermitted: isPermitted({ key: `${modelName}_create`, user }),
        criteria: {},
        onResponse: (addedUser, req, res) => {
          onPasswordReset({ userModel, email: addedUser.email }, req, res);
        }
      };
    },
    read: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_read`, user }),
        paginate: true,
        criteria: {},
        exclude: [
          "password",
          "jwtToken",
          "confirmEmailToken",
          "resetPasswordToken"
        ]
      };
    },
    update: (user, req) => {
      return {
        isPermitted: isPermitted({ key: `${modelName}_update`, user }),
        criteria: {},
        onResponse: (updatedUser, req, res) => {
          if (req.body.model.resetPassword) {
            return onPasswordReset(
              { userModel, email: updatedUser.email },
              req,
              res
            );
          }
          res.status(200).send(updatedUser);
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
  const usersApi = crudService({ Model: userModel, crudDomainLogic });

  /* Zee:
    what is this for? 
 */
  let vizDomainLogic = {
    average: (user, req, res) => {
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
      return {  };
    },
    distinct: (user, req, res) => {
      return {};
    }
  };
  const vizApi = vizService({ Model: userModel, domainLogic: vizDomainLogic });

  //file upload api
  let mediaDomainLogic = {
    saveMedia: (user, req, res) => {
      return {
        criteria: {
          tag: (user && user._id) || "default",
          token: user && user.jwtToken,
          query: { _id: req.query.query, index: req.query.index }
        },
        isPermitted: true
      };
    }
  };
  const fileUploadApi = mediaService({
    fileName: "users",
    modelName: "users",
    mediaDomainLogic,
    Model: userModel,
    fileExtension: ".jpg"
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
  registerAction({
    key: `${modelName}`,
    domainLogic: mediaDomainLogic,
    permissionsModel
  });
  registerForms({
    key: `${modelName}`,
    fields: [
      {
        type: "image",
        name: "avatar",
        placeholder: "Avatar"
      },
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
        type: "checkbox",
        name: "resetPassword",
        placeholder: "Reset Password?",
        value: false,
        required: true
      },
      {
        type: "select",
        name: "gender",
        placeholder: "Gender",
        options: ["Male", "Female"],
        required: true
      },
      {
        type: "checkbox",
        name: "isAdmin",
        placeholder: "is admin?",
        value: false
      },
      {
        type: "date",
        name: "createdAt",
        placeholder: "When was this user created?",
        value: ""
      }
    ],
    formsModel
  });

  return [usersApi, fileUploadApi, vizApi, formsApi];
};

module.exports = User;
