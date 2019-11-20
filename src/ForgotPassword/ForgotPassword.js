import React from "react";
import { ForgotPassword } from "../orbital-templates/Material/_shared/ForgotPassword/ForgotPassword";

const ForgotPasswordModule = ({
  classes,
  location,
  history,
  forgotPassword,
  match
}) => {
  return (
    <React.Fragment>
      <ForgotPassword
        classes={classes}
        location={location}
        history={history}
        forgotPassword={forgotPassword}
        match={match}
      />
    </React.Fragment>
  );
};

export default ForgotPasswordModule;
