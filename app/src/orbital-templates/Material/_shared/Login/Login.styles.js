export const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE11 issue.
    marginLeft: theme && theme.spacing(3),
    marginRight: theme && theme.spacing(3),
    [theme && theme.breakpoints.up(400 + theme && theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    },
    position: "relative",
    top: "7em"
  },
  avatar: {
    margin: theme && theme.spacing && theme.spacing(),
    backgroundColor: theme && theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE11 issue.
    marginTop: theme && theme.spacing && theme.spacing()
  },
  submit: {
    marginTop: theme && theme.spacing(3)
  }
});
