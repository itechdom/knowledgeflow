import { fade } from "@material-ui/core/styles/colorManipulator";
const drawerWidth = 180;
const appBarHeight = 64;
export const styles = theme => {
  console.log("THEME!", theme);
  return {
    root: {},
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
    menu: {},
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
    },
    buttonListItem: {
      backgroundColor: "#000000",
      color: "white",
      borderRadius: "46px",
      marginBottom: "15px"
    },
    content: {
      // flexGrow: 1,
      // height: "100vh",
      // overflow: "auto",
      // [theme.breakpoints.up("md")]: {
      // marginTop: appBarHeight,
      // marginLeft: drawerWidth
      // }
    },
    hasPadding: {
      // padding: theme.spacing(3),
      // flexGrow: 1,
      // height: "100vh",
      // overflow: "auto",
      // [theme.breakpoints.up("md")]: {
      // marginTop: appBarHeight,
      // marginLeft: drawerWidth
      // }
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
    center: {
      justifyContent: "center"
    },
    relative: {
      position: "relative"
    },
    white: {
      color: "white!important"
    }
  };
};
