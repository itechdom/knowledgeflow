import React from "react";
import ModelList from "../orbital-templates/Material/_shared/ModelList/ModelList";

const Celebrate = ({
  knowledge,
  celebrates,
  celebrates_createModel,
  celebrates_getModel,
  celebrates_updateModel,
  celebrates_deleteModel,
  celebrates_searchModel,
  celebrates_gallery_upload,
  celebrates_media_upload,
  celebrates_media_delete,
  location,
  match,
  history,
  classes,
  form,
  notifications,
  saveNotification,
  removeNotification,
  modelName,
  ...rest
}) => {
  return (
    <ModelList
      modelArray={[
        { title: "body a" },
        { title: "body b" },
        { title: "body c" }
      ]}
      modelKey={"title"}
      modelName={modelName}
      columns={["title", "status"]}
      createModel={celebrates_createModel}
      updateModel={celebrates_updateModel}
      getModel={celebrates_getModel}
      deleteModel={celebrates_deleteModel}
      searchModel={celebrates_searchModel}
      uploadMedia={celebrates_media_upload}
      uploadGallery={celebrates_gallery_upload}
      deleteMedia={celebrates_media_delete}
      location={location}
      match={match}
      history={history}
      classes={classes}
      form={form}
      notifications={notifications}
      saveNotification={saveNotification}
      removeNotification={removeNotification}
      // ModelListItemComponent={ModelListItem}
      // ModelPreviewPage={ModelPreview}
      {...rest}
    />
  );
};

export default Celebrate;
