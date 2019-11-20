import React from "react";
import { withStyles } from "@material-ui/styles";
import { Formik } from "formik";
import * as Yup from "yup";
import LockIcon from "@material-ui/icons/LockOutlined";
import theme from "Theme";
import { styles } from "./ForgotPassword.styles";
import { Route } from "react-router-dom";
import ForgotPasswordConfirm from "../ForgotPassword/ForgotPasswordConfirm";
import {
  Button,
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Grid
} from "@material-ui/core";
import Forms from "../Forms/Forms";

// Synchronous validation
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
});

const form = {
  fields: [
    {
      type: "email",
      name: "email",
      placeholder: "Your Email",
      required: true
    }
  ]
};

export const ForgotPassword = ({ forgotPassword, history, classes, match }) => {
  return (
    <>
      <Route
        exact
        path={`${match.path}`}
        render={({ match }) => {
          return (
            <Card className={classes.layout}>
              <CardHeader
                style={{ justifyContent: "center" }}
                component={props => (
                  <Grid
                    container
                    direction={"column"}
                    justifyContent={"center"}
                    alignContent="center"
                  >
                    <Avatar className={classes.avatar}>
                      <LockIcon />
                    </Avatar>
                    <Typography variant="headline">Forgot Password</Typography>
                  </Grid>
                )}
              />
              <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={(values, actions) => {
                  forgotPassword(values)
                    .then(() => {
                      history.push(`${match.url}/confirm`);
                      actions.setSubmitting(false);
                    })
                    .catch(err => {
                      actions.setErrors({ server: err });
                      actions.setSubmitting(false);
                    });
                }}
                validationSchema={forgotPasswordSchema}
                render={({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  setFieldTouched,
                  ...rest
                }) => {
                  return (
                    <>
                      <CardContent>
                        <form onSubmit={handleSubmit}>
                          <Forms
                            id="login-fields"
                            form={form}
                            errors={errors}
                            modelSchema={forgotPasswordSchema}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            values={values}
                            touched={touched}
                            isSubmitting={isSubmitting}
                            {...rest}
                          />
                        </form>
                        <CardActions style={{ justifyContent: "flex-end" }}>
                          <Button
                            variant="raised"
                            size="small"
                            color="primary"
                            onClick={handleSubmit}
                            type="submit"
                            disabled={isSubmitting}
                          >
                            login
                          </Button>
                        </CardActions>
                      </CardContent>
                    </>
                  );
                }}
              />
            </Card>
          );
        }}
      />
      <Route
        path={`${match.path}/confirm`}
        render={({ match }) => {
          return (
            <ForgotPasswordConfirm
              onDone={() => {
                history.push("/auth/login");
              }}
            />
          );
        }}
      />
    </>
  );
};

export default withStyles(styles, { defaultTheme: theme })(ForgotPassword);
