import React from "react";
import { withStyles } from "@material-ui/styles";
import theme from "../../../../theme";
import { styles } from "./ResetPassword.styles";
import { CssBaseline } from "@material-ui/core";
import LockIcon from "@material-ui/icons/LockOutlined";
import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Avatar
} from "@material-ui/core";

export const ResetPasswordConfirmation = ({ classes, onDone, history }) => {
  return (
    <React.Fragment>
      <Grid
        alignContent="center"
        alignItems="center"
        justify="center"
        container
      >
        <Grid item>
          <Typography variant="headline">
            Your password has been reset!
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles, { defaultTheme: theme })(
  ResetPasswordConfirmation
);
