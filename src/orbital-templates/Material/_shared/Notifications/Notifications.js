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
import * as Yup from "yup";

let form = {
  fields: [
    {
      type: "checkbox",
      name: "hasEnabledNotification",
      placeholder: "Enable Notifications?",
      required: true
    }
  ]
};

export const Notifications = ({
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
                <Icon>legal</Icon>
              </Avatar>
            )}
            <Typography
              style={{ textAlign: "center", fontWeight: "bold" }}
              variant="headline"
            >
              Notifications
            </Typography>
          </Grid>
        )}
      />
      <Formik
        initialValues={{ hasEnabledNotification: true }}
        onSubmit={(values, actions) => {
          onSuccess(values);
        }}
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
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    values={values}
                    touched={touched}
                    isSubmitting={isSubmitting}
                    {...rest}
                  />
                  <Grid container direction="column">
                    <Button
                      color="secondary"
                      variant="contained"
                      color="secondary"
                      onClick={handleSubmit}
                    >
                      Next
                    </Button>
                  </Grid>
                </form>
              </CardContent>
            </>
          );
        }}
      />
    </Card>
  );
};

export default Notifications;
