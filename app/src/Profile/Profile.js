import React from "react";
import ModelEdit from "../orbital-templates/Material/_shared/ModelEdit/ModelEdit";
import ClientNotification from "../orbital-templates/Material/_shared/ClientNotification/ClientNotification";

const Profile = ({
  user,
  users,
  users_createModel,
  users_getModel,
  users_updateModel,
  users_deleteModel,
  users_searchModel,
  users_gallery_upload,
  users_media_upload,
  users_media,
  users_gallery,
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
    <>
      <ModelEdit
        onSave={(model, values) => {
          users_updateModel(model, values);
        }}
        model={user}
        modelKey={"name"}
        modelName={"profile"}
        createModel={users_createModel}
        updateModel={users_updateModel}
        getModel={users_getModel}
        deleteModel={users_deleteModel}
        searchModel={users_searchModel}
        uploadMedia={users_media_upload}
        uploadGallery={users_gallery_upload}
        gallery={users_gallery}
        media={users_media}
        location={location}
        match={match}
        history={history}
        classes={classes}
        form={form}
        notifications={notifications}
        saveNotification={saveNotification}
        removeNotification={removeNotification}
        onMediaUploadComplete={(model, media) => {
          users_updateModel(model, { image: `${media}&q=${Date.now()}` });
        }}
      />
      <ClientNotification
        notifications={notifications}
        handleClose={(event, reason, notification) => {
          removeNotification(notification);
        }}
      />
    </>
  );
};

export default Profile;
