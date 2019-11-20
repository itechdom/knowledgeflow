export const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  layout: {
    width: "auto",
    display: "block", // Fix IE11 issue.
    marginLeft: theme && theme.spacing(3),
    marginRight: theme && theme.spacing(3),
    [theme && theme.breakpoints.up(400 + theme && theme.spacing(3) * 2)]: {
      width: 750,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  textField: {
    margin: "1em 0"
  },
  formControl: {
    margin: theme && theme.spacing && theme.spacing(),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme && theme.spacing(2)
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme && theme.spacing && theme.spacing() * 4,
    backgroundColor: theme && theme.palette.background.default
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: "hidden",
    display: "block",
    width: "100%"
  },
  chipTextField: {
    color: "rgba(0, 0, 0, 0.87)",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    borderRadius: "16px",
    verticalAlign: "middle",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#e0e0e0"
  }
});
