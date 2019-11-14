import React from "react";
import { Route, Link } from "react-router-dom";
import AdminEdit from "./AdminEdit";
import { MainWrapper } from "../orbital-templates/Material/Wrappers/MainWrapper";
import { CircularProgress } from "@material-ui/core";

//this will take Admin from "admin-service"
//and pass in the MODALS that will be used to edit the resource
//MODALS then will just be wrapped in a crud component that will pass it the (getModel,createModel,updateModel...etc)
const AdminPage = ({
  schemas,
  crudDomainStore,
  formsDomainStore,
  notificationDomainStore,
  location,
  match,
  history,
  isLoggedIn,
  user,
  onLogout,
  logo,
  classes
}) => {
  let routeList =
    schemas &&
    schemas.map(schema => {
      return {
        url: schema.resource && `${match.path}/${schema.resource.defaultValue}`,
        name: schema.modelName,
        icon: schema.resource.defaultValue
      };
    });
  if (Array.isArray(schemas)) {
    return (
      <MainWrapper
        routeList={routeList}
        location={location}
        match={match}
        history={history}
        auth={isLoggedIn}
        user={user}
        logo={logo}
        onLogout={onLogout}
        crudDomainStore={crudDomainStore}
        classes={classes}
        noMargin={true}
        user={user}
        disableToggle={true}
      >
        <Route
          path={`${match.path}/:modelName`}
          render={({ match }) => {
            return (
              <AdminEdit
                crudDomainStore={crudDomainStore}
                formsDomainStore={formsDomainStore}
                notificationDomainStore={notificationDomainStore}
                modelName={match.params.modelName}
                schema={schemas.find(schema => {
                  return (
                    schema.modelName.toLowerCase() ===
                    match.params.modelName.toLowerCase()
                  );
                })}
                location={location}
                match={match}
                history={history}
              />
            );
          }}
        />
      </MainWrapper>
    );
  }
  return <CircularProgress />;
};

export default AdminPage;
