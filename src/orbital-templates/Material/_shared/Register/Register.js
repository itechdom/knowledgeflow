import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Typography,
  Avatar,
  Icon,
  Grid
} from "@material-ui/core";
import Forms from "../Forms/Forms";
import { Formik } from "formik";
import ClientNotification from "../ClientNotification/ClientNotification";
import * as Yup from "yup";

// Synchronous validation
const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required("Required"),
  password: Yup.string().required("Required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords do not match"
  )
});

let form = {
  fields: [
    {
      type: "text",
      name: "name",
      placeholder: "Name",
      required: true
    },
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
    },
    {
      type: "password",
      name: "confirmPassword",
      placeholder: "Confirm password",
      required: true
    }
  ]
};

export const Register = ({
  onChange,
  onSubmit,
  onProviderAuth,
  onSuccess,
  onLogin,
  onForgotPassword,
  classes,
  location,
  history,
  match,
  logo
}) => {
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
            {logo ? (
              <img className={classes.logo} src={logo} />
            ) : (
              <Avatar className={classes.avatar}>
                <Icon>keyboard</Icon>
              </Avatar>
            )}
            <Typography
              style={{ textAlign: "center", fontWeight: "bold" }}
              variant="headline"
            >
              Sign Up
            </Typography>
          </Grid>
        )}
      />
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(res => {
              onSuccess(res);
              actions.setSubmitting(false);
            })
            .catch(err => {
              actions.setErrors({ server: err });
              actions.setSubmitting(false);
            });
        }}
        validationSchema={registerSchema}
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
                    modelSchema={registerSchema}
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
                    fullWidth={true}
                    color="secondary"
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Register
                  </Button>
                </CardActions>
                <Grid container direction="column">
                  <Button
                    color="secondary"
                    variant="outlined"
                    color="secondary"
                    onClick={onLogin}
                  >
                    <Typography
                      style={{ textTransform: "lowercase" }}
                      variant="subtitle2"
                      color="primary"
                    >
                      already have an account? login here
                    </Typography>
                  </Button>
                </Grid>
                {notifications && notifications.length > 0 && submitCount > 0 && (
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
  );
};

export default Register;
