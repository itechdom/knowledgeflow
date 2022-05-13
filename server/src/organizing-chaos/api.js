const mongoose = require("mongoose");
const blogsSchema = require("@markab.io/orbital-api/MongoDb/models/blogs");
const blogsModel = mongoose.model("Blogs", blogsSchema);
const eventsSchema = require("@markab.io/orbital-api/MongoDb/models/events");
const eventsModel = mongoose.model("Events", eventsSchema);
const commentsSchema = require("@markab.io/orbital-api/MongoDb/models/comments");
const commentsModel = mongoose.model("Comments", commentsSchema);
const tagSchema = require("@markab.io/orbital-api/MongoDb/models/tags");
const tagsModel = mongoose.model("Tags", tagSchema);
const blogsApi = require("./Blogs");
const commentsApi = require("./Comments");
const tagsApi = require("./Tags");
const eventsApi = require("./Events");

//api
const Api = ({
  config,
  kernelModel,
  permissionsModel,
  settingsModel,
  userModel,
  formsModel,
  notificationsModel
}) => {
  const defaultProps = {
    kernelModel,
    permissionsModel,
    settingsModel,
    formsModel,
    notificationsModel
  };
  let eventsApiRoutes = eventsApi({
    config,
    eventsModel,
    permissionsModel,
    formsModel
  });
  let blogsApiRoutes = blogsApi({
    config,
    blogsModel,
    ...defaultProps
  });
  let tagsApiRoutes = tagsApi({
    config,
    tagsModel,
    permissionsModel,
    formsModel
  });
  let commentsApiRoutes = commentsApi({
    config,
    commentsModel,
    permissionsModel,
    formsModel
  });
  return {
    blogsApiRoutes,
    eventsApiRoutes,
    tagsApiRoutes,
    commentsApiRoutes
  };
};

module.exports = Api;
