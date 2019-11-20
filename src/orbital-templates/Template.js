import React from "react";
import ModelList from "../../Pages/ModelList/ModelList";
import { styles } from "./User.styles";
import userSchema from "../../../../Models/user";
import { withStyles } from '@material-ui/core';

let ModelName = "user";

const User = ({
  user,
  user_createModel,
  user_getModel,
  user_updateModel,
  user_deleteModel,
  user_searchModel,
  user_setModelEdit,
  user_isEditing,
  user_setIsEditing,
  user_editedModel,
  user_gallery_get,
  user_gallery_upload,
  user_media_upload,
  user_media_get,
  user_media_add,
  user_media_remove,
  user_media,
  user_gallery,
  user_gallery_add,
  user_gallery_remove,
  location,
  match,
  history,
  classes,
  form,
  notifications,
  saveNotification,
  removeNotification,
  ...rest
}) => {
  return (
    <ModelList
      modelArray={user}
      modelKey={"name"}
      modelName={"user"}
      columns={["name", "email"]}
      modelSchema={userSchema}
      createModel={user_createModel}
      updateModel={user_updateModel}
      getModel={user_getModel}
      deleteModel={user_deleteModel}
      setModelEdit={user_setModelEdit}
      searchModel={user_searchModel}
      editedModel={user_editedModel}
      setIsEditing={user_setIsEditing}
      isEditing={user_isEditing}
      uploadMedia={user_media_upload}
      uploadGallery={user_gallery_upload}
      gallery={user_gallery}
      media={user_media}
      location={location}
      match={match}
      history={history}
      classes={classes}
      form={form}
      notifications={notifications}
      saveNotification={saveNotification}
      removeNotification={removeNotification}
    />
  );
};

export default withStyles(styles)(User);
