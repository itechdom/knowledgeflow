import { fade } from "@material-ui/core/styles/colorManipulator";
const drawerWidth = 180;
const appBarHeight = 64;
export const styles = theme => {
  return {
    root: {},
    hasPadding: {},
    card: {
      width: "100%"
    },
    content: {
      marginTop: "2em"
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
      height: appBarHeight
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px"
    },
    tabs: {},
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    chip: {
      width: "100px",
      height: "auto",
      padding: "0.5em",
      margin: "0.5em"
    },
    chip__selected: {
      backgroundColor: "#d32fa559",
      width: "100px",
      height: "auto",
      padding: "0.5em",
      margin: "0.5em"
    },
    menu: {
      backgroundColor: "white",
      color: "#000000"
    },
    menuButton: {
      // marginLeft: 30,
      // marginRight: 20
    },
    menuDropdown: {
      // marginLeft: -12,
      // marginRight: 20
    },
    menuButtonHidden: {
      // display: "none"
    },
    title: {
      // flexGrow: 1
      color: "#000000"
    },
    buttonListItem: {
      backgroundColor: "#000000",
      color: "white",
      borderRadius: "46px",
      marginBottom: "15px"
    },
    layout: {
      width: "auto",
      display: "block", // Fix IE11 issue.
      position: "relative",
      top: "7em"
    },
    paper: {
      paddingTop: "1em",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
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
    },
    chartContainer: {
      // marginLeft: -22
    },
    tableContainer: {
      // height: 320
    },
    search: {
      // position: "relative",
      // borderRadius: theme.shape.borderRadius,
      // backgroundColor: fade(theme.palette.common.white, 0.15),
      // "&:hover": {
      // backgroundColor: fade(theme.palette.common.white, 0.25)
      // },
      // marginLeft: 0,
      // width: "100%",
      // [theme.breakpoints.up("sm")]: {
      // marginLeft: theme.spacing(1),
      // width: "auto"
      // }
    },
    searchIcon: {
      // width: theme.spacing.unit * 9,
      // height: "100%",
      // position: "absolute",
      // pointerEvents: "none",
      // display: "flex",
      // alignItems: "center",
      // justifyContent: "center"
    },
    sidebar: {
      // marginTop: appBarHeight,
      // width: drawerWidth,
      // position: "fixed"
    },
    inputRoot: {
      // color: "inherit",
      // width: "100%"
    },
    inputInput: {
      // paddingTop: theme.spacing.unit,
      // paddingRight: theme.spacing.unit,
      // paddingBottom: theme.spacing.unit,
      // paddingLeft: theme.spacing.unit * 10,
      // transition: theme.transitions.create("width"),
      // width: "100%",
      // [theme.breakpoints.up("sm")]: {
      //   width: 120,
      //   "&:focus": {
      //     width: 200
      //   }
      // }
    },
    "users.cardImage": {
      // borderRadius: "150px",
      // width: "50%",
      // marginLeft: "auto",
      // marginRight: "auto",
      // marginBottom: "22px"
    },
    top1: {
      marginTop: "10px"
    },
    top10: {
      marginTop: "1em"
    },
    top20: {
      marginTop: "2em"
    },
    top30: {
      marginTop: "3em"
    },
    top40: {
      marginTop: "4em"
    },
    top50: {
      marginTop: "5em"
    },
    top60: {
      marginTop: "6em"
    },
    top70: {
      marginTop: "7em"
    },
    top80: {
      marginTop: "8em"
    },
    top90: {
      marginTop: "9em"
    },
    top95: {
      marginTop: "9.1em"
    },
    top100: {
      marginTop: "10em"
    },
    bottom1: {
      marginBottom: "10px"
    },
    bottom10: {
      marginBottom: "1em"
    },
    bottom20: {
      marginBottom: "2em"
    },
    bottom30: {
      marginBottom: "3em"
    },
    bottom40: {
      marginBottom: "4em"
    },
    bottom50: {
      marginBottom: "5em"
    },
    bottom60: {
      marginBottom: "6em"
    },
    bottom70: {
      marginBottom: "7em"
    },
    bottom80: {
      marginBottom: "8em"
    },
    bottom90: {
      marginBottom: "9em"
    },
    bottom95: {
      marginBottom: "9.1em"
    },
    bottom100: {
      marginBottom: "10em"
    },
    center: {
      display: "flex",
      justifyContent: "center"
    },
    start: {
      display: "flex",
      justifyContent: "flex-start"
    },
    end: {
      display: "flex",
      justifyContent: "flex-end"
    },
    relative: {
      position: "relative"
    },
    white: {
      color: "white!important"
    },
    noScroll: {
      maxHeight: "100vh"
    },
    noHeight: {
      height: "0px"
    },
    noWidth: {
      width: "0px"
    },
    noMargin: {
      margin: "0px"
    },
    noPadding: {
      padding: "0px"
    },
    bold: {
      fontWeight: "bold"
    }
  };
};
