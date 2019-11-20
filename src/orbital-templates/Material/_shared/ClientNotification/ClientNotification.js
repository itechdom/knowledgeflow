import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import WarningIcon from "@material-ui/icons/Warning";
import theme from "Theme";
// import theme from "Theme";
import { withStyles } from "@material-ui/styles";
import { IconButton, Snackbar, SnackbarContent } from "@material-ui/core";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles1 = theme => {
  return {
    success: {
      backgroundColor: green[600]
    },
    error: {
      backgroundColor: theme && theme.palette && theme.palette.error.main
    },
    info: {
      backgroundColor: theme && theme.palette && theme.palette.secondary.main
    },
    warning: {
      backgroundColor: amber[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9
      // marginRight: theme && theme.spacing(1)
    },
    message: {
      display: "flex",
      alignItems: "center"
    }
  };
};

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {typeof message === "string"
            ? message
            : "Error! Please contact support at samalghanmi@markab.io, Error code: 001"}
        </span>
      }
      position={"bottom-right"}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = theme => {
  return {
    margin: {
      margin: theme && theme.spacing && theme.spacing(1)
    }
  };
};

class CustomizedSnackbars extends React.Component {
  render() {
    const { classes, notifications, handleClose } = this.props;
    if (notifications && notifications.length > 0) {
      let notifyView = notifications.map(notification => {
        return (
          !notification.deleted && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
              }}
              autoHideDuration={6000}
              open={true}
              onClose={(event, reason) =>
                handleClose(event, reason, notification)
              }
            >
              <MySnackbarContentWrapper
                onClose={(event, reason) =>
                  handleClose(event, reason, notification)
                }
                variant={notification.type}
                message={notification.message}
              />
            </Snackbar>
          )
        );
      });
      return <div>{notifyView}</div>;
    }
    return <div />;
  }
}

CustomizedSnackbars.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles2, { defaultTheme: theme })(
  CustomizedSnackbars
);
