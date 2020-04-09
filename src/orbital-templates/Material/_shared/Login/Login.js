import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import LockIcon from "@material-ui/icons/LockOutlined";
import ClientNotification from "../ClientNotification/ClientNotification";
import {
  Button,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Grid
} from "@material-ui/core";
import Forms from "../Forms/Forms";

// Synchronous validation
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string().required("Required")
});

const form = {
  fields: [
    {
      type: "email",
      name: "email",
      placeholder: "Email",
      required: true
    },
    {
      type: "password",
      name: "password",
      placeholder: "Password",
      required: true
    }
  ]
};

export const Login = ({
  onChange,
  onSubmit,
  onProviderAuth,
  onRegister,
  onForgotPassword,
  classes,
  location,
  history,
  match,
  onSuccess,
  logo,
  ...rest
}) => {
  return (
    (classes && (
      <Card
        style={{ position: "relative", top: "6em" }}
        className={classes.layout}
      >
        <CardHeader
          style={{ justifyContent: "center" }}
          component={props => (
            <Grid
              container
              direction={"column"}
              justifyContent={"center"}
              alignContent="center"
            >
              {logo ? (
                <img className={classes.logo} src={logo} />
              ) : (
                <Avatar className={classes.avatar}>
                  <LockIcon />
                </Avatar>
              )}
              <Typography
                style={{ textAlign: "center", fontWeight: "bold" }}
                variant="headline"
              >
                Sign in
              </Typography>
            </Grid>
          )}
        />
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, actions) => {
            onSubmit(values)
              .then(() => {
                onSuccess ? onSuccess(values) : history.push("/");
                actions.setSubmitting(false);
              })
              .catch(err => {
                actions.setErrors({ server: err });
                actions.setSubmitting(false);
              });
          }}
          validationSchema={loginSchema}
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
            submitCount,
            setErrors,
            ...rest
          }) => {
            let notifications =
              errors &&
              Object.keys(errors).map(k => {
                return {
                  message: `${k}: ${errors[k]}`,
                  type: "error"
                };
              });
            return (
              <>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Forms
                      id="login-fields"
                      form={form}
                      errors={errors}
                      modelSchema={loginSchema}
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
                      variant="contained"
                      color="secondary"
                      fullWidth={true}
                      onClick={handleSubmit}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      login
                    </Button>
                  </CardActions>
                  <Grid container direction="column">
                    <Button
                      color="secondary"
                      fullWidth={true}
                      vairant="outlined"
                      onClick={onForgotPassword}
                    >
                      <Typography
                        style={{ textTransform: "lowercase" }}
                        variant="subtitle2"
                        color="primary"
                      >
                        Forgot Password?
                      </Typography>
                    </Button>
                    <Button
                      color="secondary"
                      variant="outlined"
                      fullWidth={true}
                      onClick={onRegister}
                    >
                      <Typography
                        style={{ textTransform: "lowercase" }}
                        variant="subtitle2"
                        color="primary"
                      >
                        You don't have an account? register here
                      </Typography>
                    </Button>
                  </Grid>
                  {notifications &&
                    notifications.length > 0 &&
                    submitCount > 0 && (
                      <ClientNotification
                        notifications={
                          (notifications.length > 0 && notifications) || []
                        }
                        handleClose={() => {
                          setErrors({});
                        }}
                      />
                    )}
                </CardContent>
              </>
            );
          }}
        />
      </Card>
    )) || <>no classes</>
  );
};

export default Login;
