import React from "react";
import { withStyles } from "@material-ui/styles";
import theme from "Theme";
import { styles } from "./ForgotPassword.styles";
import { CssBaseline } from "@material-ui/core";
import { Typography, Button } from "@material-ui/core";

export const ForgotPasswordConfirm = ({ classes, onDone }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography variant="headline">
        Please check your email for a password reset link
      </Typography>
      <Button color="primary" onClick={onDone}>
        Reset Password
      </Button>
    </React.Fragment>
  );
};

export default withStyles(styles, { defaultTheme: theme })(
  ForgotPasswordConfirm
);
