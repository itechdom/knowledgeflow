import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/styles";
import theme from "Theme";
import AddIcon from "@material-ui/icons/Add";
import { Fab } from "@material-ui/core";

const styles = theme => {
  return {
    fab: {
      bottom: "0px",
      right: theme && theme.spacing && theme.spacing(2)
    }
  };
};

class FloatingAddButton extends React.Component {
  render() {
    const { classes, onClick } = this.props;
    return (
      <Fab
        style={{ position: "fixed" }}
        onClick={onClick}
        className={classes.fab}
        color={"primary"}
      >
        <AddIcon />
      </Fab>
    );
  }
}

FloatingAddButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { defaultTheme: theme })(FloatingAddButton);
