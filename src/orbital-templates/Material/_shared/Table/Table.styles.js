import { lighten } from "@material-ui/core/styles/colorManipulator";
export const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme && theme.spacing(3)
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

export const toolbarStyles = theme => ({
  root: {
    paddingRight: theme && theme.spacing && theme.spacing()
  },
  highlight:
    theme && theme.palette.type === "light"
      ? {
          color: theme && theme.palette.secondary.main,
          backgroundColor: lighten(theme && theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme && theme.palette.text.primary,
          backgroundColor: theme && theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme && theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});
