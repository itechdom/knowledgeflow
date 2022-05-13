//the crud service creates [create, read, update, del] endpoints for a mongoose model
const mediaService = require("@markab.io/node/media-service/media-service")

const Media = ({ config }) => {
  //file upoad api
  let mediaDomainLogic = {
    getMedia: (user, file) => {
      return { criteria: { tag: user._id }, isPermitted: true };
    },
    saveMedia: (user, files) => {
      return { criteria: { tag: user._id }, isPermitted: true };
    }
  };
  const fileUploadApi = mediaService({
    mediaDomainLogic
  });

  return [fileUploadApi];
};

module.exports =  Media;
