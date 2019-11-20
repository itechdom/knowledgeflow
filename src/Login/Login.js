import React from "react";
import { Login } from "../orbital-templates/Material/_shared/Login/Login";

const LoginModule = ({
  onChange,
  onSubmit,
  onProviderAuth,
  onRegister,
  onForgotPassword,
  onSuccess,
  location,
  history,
  match,
  ...rest
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
        location={location}
        history={history}
        match={match}
        {...rest}
      />
    </React.Fragment>
  );
};

export default LoginModule;
