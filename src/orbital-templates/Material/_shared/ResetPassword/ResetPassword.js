import React from "react";
import { withStyles } from "@material-ui/styles";
import theme from "Theme";
import { Formik } from "formik";
import * as Yup from "yup";
import LockIcon from "@material-ui/icons/LockOutlined";
import { Route } from "react-router-dom";
import { styles } from "./ResetPassword.styles";
import ResetPasswordConfirm from "../ResetPassword/ResetPasswordConfirm";
import queryString from "query-string";
import {
  Button,
  Typography,
  Avatar,
  CssBaseline,
  Paper
} from "@material-ui/core";
import * as Inputs from "../Forms/Inputs";

// Synchronous validation
const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string().required("Required"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Passwords do not match"
  )
});

let fields = [
  {
    type: "password",
    name: "newPassword",
    placeholder: "New Password",
    required: true
  },
  {
    type: "password",
    name: "confirmNewPassword",
    placeholder: "Confirm New password",
    required: true
  }
];

export const ResetPassword = ({
  changePassword,
  classes,
  location,
  history,
  match
}) => {
  let { token, email } = queryString.parse(location.search);
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Avatar className={classes.avatar}>
          <LockIcon />
        </Avatar>
        <Route
          exact
          path={`${match.path}`}
          render={({ match }) => {
            return (
              <Paper className={classes.paper}>
                <Typography variant="headline">Reset Password</Typography>
                <Formik
                  initialValues={{ newPassword: "", confirmNewPassword: "" }}
                  onSubmit={(values, actions) => {
                    let { newPassword } = values;
                    changePassword({ newPassword, email, token })
                      .then(() => {
                        history.push(`${match.url}/confirm`);
                        actions.setSubmitting(false);
                      })
                      .catch(err => {
                        actions.setErrors({ server: err });
                        actions.setSubmitting(false);
                      });
                  }}
                  validationSchema={ResetPasswordSchema}
                  render={({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting
                  }) => {
                    return (
                      <form onSubmit={handleSubmit}>
                        {errors.server && (
                          <Typography color="error">{errors.server}</Typography>
                        )}
                        {fields.map((field, index) => {
                          return (
                            <div key={index}>
                              <Inputs.TextFieldInput
                                id={field.name}
                                label={field.placeholder}
                                type={field.type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maegin="normal"
                                required={field.required}
                                onKeyPress={event =>
                                  event.key === 13 ? handleSubmit() : ""
                                }
                              />
                              {errors[field.name] && touched[field.name] && (
                                <Typography color="error">
                                  {errors[field.name]}
                                </Typography>
                              )}
                            </div>
                          );
                        })}
                        <Button
                          size="small"
                          color="primary"
                          onClick={handleSubmit}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Reset Password
                        </Button>
                      </form>
                    );
                  }}
                />
              </Paper>
            );
          }}
        />
        <Route
          path={`${match.path}/confirm`}
          render={({ match }) => {
            return (
              <ResetPasswordConfirm
                onDone={() => {
                  history.push("/auth/login");
                }}
              />
            );
          }}
        />
      </main>
    </React.Fragment>
  );
};

export default withStyles(styles, { defaultTheme: theme })(ResetPassword);
