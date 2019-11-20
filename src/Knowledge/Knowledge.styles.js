import { fade } from "@material-ui/core/styles/colorManipulator";
export const styles = theme => ({
  "@global": {
    ".image-gallery img": {
      height: "200px"
    }
  },
  boot: {
    width: "100"
  },
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  autocomplete: {
    marginTop: "3em"
  },
  title: {},
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(9),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  listContainer: {
    marginTop: "2em"
  },
  autocomplete: {
    width: "100%"
  },
  autocompleteContainer: {
    borderRadius: "30px",
    marginTop: "30px",
    marginBottom: "30px"
  },
  viewOptionContainer: {
    marginTop: "1em"
  },
  viewOption: {
    marginRight: "2px"
  },
  viewOptionSelected: {
    backgroundColor: theme.palette.primary.main,
    color: "white"
  },
  toolbar: {},
  toolbarIcon: {},
  appBar: {},
  menuDropdown: {},
  menuButtonHidden: {},
  content: {},
  chartContainer: {},
  breadcrumbs: {},
  tabs: {},
  tableContainer: {},
  boot: {},
  root: {},
  grow: {},
  title: {},
  search: {},
  searchIcon: {},
  inputRoot: {},
  inptInput: {}
});
