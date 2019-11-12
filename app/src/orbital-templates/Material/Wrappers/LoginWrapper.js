import React, { Children } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge
} from "@material-ui/core";

class LoginWrapper extends React.Component {
  render() {
    console.log("here in login wrapper");
    const { classes, children, backgroundImage } = this.props;
    return (
      <React.Fragment>
        <main
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: "no-repeat",
            height: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            width: "100%",
            height: "1000px",
            objectFit: "cover"
          }}
        >
          {children}
        </main>
      </React.Fragment>
    );
  }
}

LoginWrapper.propTypes = {
  classes: PropTypes.object.isRequired
};

export default LoginWrapper;
