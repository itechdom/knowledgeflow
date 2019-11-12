import React from "react";
import theme from "Theme";
import { withStyles } from "@material-ui/styles";
import { styles } from "./Loading.styles";
import { Grid } from "@material-ui/core";
import { Typography, CircularProgress } from "@material-ui/core";

function Loading(props) {
  const { classes, logo, title, err } = props;
  return (
    <React.Fragment>
      <Grid container justify="center">
        <Grid item>
          {logo ? (
            <img className="loading" width="200px" height="auto" src={logo} />
          ) : (
            <CircularProgress color="primary" />
          )}
        </Grid>
        {err && err.error && (
          <Grid item>
            {err.error.message}:{err.error.stack}
          </Grid>
        )}
      </Grid>
      <Typography
        variant="display3"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        {title}
      </Typography>
    </React.Fragment>
  );
}

export default withStyles(styles, { defaultTheme: theme })(Loading);
