import React from "react";
import { withStyles } from "@material-ui/styles";
import theme from "../../../../theme";
import { styles } from "./EmailConfirmation.styles";
import { CssBaseline } from "@material-ui/core";
import LockIcon from "@material-ui/icons/LockOutlined";
import queryString from "query-string";
import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Avatar
} from "@material-ui/core";

export const EmailConfirmation = ({
  classes,
  location,
  onDone,
  confirmEmail
}) => {
  let { token, email } = queryString.parse(location.search);
  let [confirmed, setConfirmed] = React.useState(false);
  let [err, setErr] = React.useState();
  React.useEffect(() => {
    confirmEmail({ email, token })
      .then(() => {
        setConfirmed(true);
      })
      .catch(err => {
        setErr(err);
      });
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <Card className={classes.layout}>
        <CardHeader
          className={classes["top30"]}
          component={props => (
            <Grid
              container
              direction={"column"}
              justifyContent={"center"}
              alignContent="center"
            >
              <Typography className={classes.bold} variant="headline">
                Confirmation
              </Typography>
            </Grid>
          )}
        />
        <CardContent>
          <Grid
            alignContent="center"
            alignItems="center"
            justify="center"
            container
            className={classes["top10"]}
          >
            <Grid item>
              <Typography variant="headline">
                {confirmed
                  ? `Your email has been confirmed`
                  : `confirming your email ...`}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justify="center"
            alignContent="center"
            alignItems="center"
            className={classes["top20"]}
          >
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={onDone}>
                Back to App
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default withStyles(styles, { defaultTheme: theme })(EmailConfirmation);
