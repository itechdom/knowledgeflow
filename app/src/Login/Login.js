import React from "react";
import { Login } from "../orbital-templates/Material/_shared/Login/Login";

const LoginModule = ({
  onChange,
  onSubmit,
  onProviderAuth,
  onRegister,
  onForgotPassword,
  onSuccess,
  classes,
  location,
  history,
  match
}) => {
  return (
    <React.Fragment>
      <Login
        onChange={onChange}
        onSubmit={onSubmit}
        onProviderAuth={onProviderAuth}
        onRegister={onRegister}
        onForgotPassword={onForgotPassword}
        onSuccess={onSuccess}
        classes={classes}
        location={location}
        history={history}
        match={match}
      />
    </React.Fragment>
  );
};

export default LoginModule;
