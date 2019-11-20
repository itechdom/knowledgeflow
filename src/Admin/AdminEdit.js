import React from "react";
import { withCrud, Forms, Notification } from "@markab.io/react";
import { Route, withRouter } from "react-router-dom";
import { MainWrapper } from "../orbital-templates/Material/Wrappers/MainWrapper";
import { compose, withPropsOnChange } from "recompose";
import { CircularProgress } from "@material-ui/core";

const AdminDetail = ({
  model,
  modelName,
  getModel,
  deleteModel,
  createModel,
  updateModel,
  searchModel,
  isEditing,
  setIsEditing,
  setModelEdit,
  editedModel,
  match,
  history,
  location,
  form,
  notifications,
  saveNotification,
  removeNotification
}) => {
  if (model && model.length > 0) {
    // getGallery={gallery_get}
    // uploadGallery={gallery_upload}
    // getMedia={media_get}
    // uploadMedia={media_upload}
    // media={media}
    // gallery={gallery}
    return (
      <ModelList
        modelName={modelName}
        modelArray={model}
        createModel={createModel}
        updateModel={updateModel}
        getModel={getModel}
        deleteModel={deleteModel}
        setModelEdit={setModelEdit}
        searchModel={searchModel}
        editedModel={editedModel}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        location={location}
        match={match}
        history={history}
        classes={{}}
        form={form}
        notifications={notifications}
        saveNotification={saveNotification}
        removeNotification={removeNotification}
        columns={["title", "name"]}
        onView={model => {
          history.push(
            `${match.path.replace(":modelName", modelName)}/view/${model._id}`
          );
        }}
        onAdd={() => {
          history.push(`${match.path.replace(":modelName", modelName)}/add`);
        }}
        onEdit={model => {
          history.push(
            `${match.path.replace(":modelName", modelName)}/edit/${model._id}`
          );
        }}
        onSearchSelect={suggestion => {
          history.push(
            `${match.path.replace(":modelName", modelName)}/view/${
              suggestion._id
            }`
          );
        }}
      />
    );
  }
  return <React.Fragment />;
};

const AdminDetailWithRouteChange = withPropsOnChange(["modelName"], props => {
  let { query, getModel } = props;
  //update model when modelName props changes
  getModel(query);
})(AdminDetail);

const AdminEdit = ({
  location,
  match,
  history,
  classes,
  detail,
  formsDomainStore,
  notificationDomainStore,
  model,
  getModel,
  deleteModel,
  createModel,
  updateModel,
  searchModel,
  isEditing,
  setIsEditing,
  setModelEdit,
  editedModel,
  searchModels,
  ...rest
}) => {
  let modelName = match.params.modelName;
  if (modelName) {
    return (
      <Route exact path={`${match.path}`}>
        <Forms modelName={modelName} formsDomainStore={formsDomainStore}>
          <Notification
            modelName={modelName}
            notificationDomainStore={notificationDomainStore}
          >
            <AdminDetailWithRouteChange
              match={match}
              history={history}
              location={location}
              model={rest[modelName]}
              modelName={modelName}
              getModel={getModel}
              deleteModel={deleteModel}
              createModel={createModel}
              updateModel={updateModel}
              searchModel={a => {
                const firstKey = Object.keys(a)[0];
                let query = {};
                query["title"] = a[firstKey];
                return rest[`${modelName}_searchModel`](query);
              }}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setModelEdit={setModelEdit}
              editedModel={editedModel}
            />
          </Notification>
        </Forms>
      </Route>
    );
  }
  return <CircularProgress />;
};

export default compose(withCrud)(AdminEdit);
