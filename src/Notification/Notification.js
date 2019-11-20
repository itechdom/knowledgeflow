import React from "react";
import ModelList from "../orbital-templates/Material/_shared/ModelList/ModelList";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./Notification.styles";

const Notification = ({
  location,
  match,
  history,
  classes,
  form,
  notifications,
  saveNotification,
  removeNotification,
  modelName
}) => {
  return (
    <ModelList
      modelArray={notifications}
      modelKey={"title"}
      modelName={modelName}
      columns={["title", "status"]}
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

export default withStyles(styles)(Notification);
