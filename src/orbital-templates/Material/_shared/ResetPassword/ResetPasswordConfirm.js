import React from "react";
import { withStyles } from "@material-ui/styles";
import theme from "Theme";
import { styles } from "./ResetPassword.styles";
import { Typography, Button } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";

export const ResetPasswordConfirm = ({ classes, onDone }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography variant="headline">Your password has been changed</Typography>
      <Button color="primary" onClick={onDone}>
        Go to Login Page
      </Button>
    </React.Fragment>
  );
};

export default withStyles(styles, { defaultTheme: theme })(
  ResetPasswordConfirm
);
