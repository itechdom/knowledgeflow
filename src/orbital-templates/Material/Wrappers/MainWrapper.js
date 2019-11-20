import React, { Children } from "react";
import classNames from "classnames";
import MenuIcon from "@material-ui/icons/Menu";
import { compose, withState } from "recompose";
import { Routes } from "./Routes";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Hidden,
  Tabs,
  Tab,
  Drawer,
  Paper,
  Grid
} from "@material-ui/core";
const Icon = ({ children }) => {
  return <i className="material-icons">{children}</i>;
};
const enhance = compose(
  withState("open", "setOpen", false),
  withState("menuOpen", "setMenuOpen", false),
  withState("anchorEl", "setAnchorEl", null),
  withState("title", "setTitle", ""),
  withState("route", "setRoute", 0)
);

const MainWrapper = props => {
  const {
    children,
    location,
    match,
    history,
    auth,
    user,
    logo,
    onLogout,
    routeList,
    drawerRouteList,
    brand,
    anchorEl,
    setAnchorEl,
    open,
    setOpen,
    setMenuOpen,
    classes,
    isTabMenu,
    tabMenuPosition,
    onDrawerRouteClick,
    onRouteClick,
    selectedRoute,
    hideDrawer,
    render
  } = props;
  const isAnchor = Boolean(anchorEl);
  let route = routeList.filter(({ name, url }) => {
    return location.pathname.replace("/", "/").indexOf(url) !== -1;
  });
  let currentRoute = selectedRoute
    ? selectedRoute
    : (route.length > 0 && routeList.indexOf(route[route.length - 1])) || 0;
  let isRoot = routeList[currentRoute] === "/";
  // console.log("ISROOOT!", routeList[currentRoute]);
  // console.log("MAIN WRAPPER CLASSES", classes);
  return (
    <>
      <CssBaseline />
      <div className={classes.root}>
        {isTabMenu && (
          <AppBar
            style={{
              bottom: tabMenuPosition === "top" ? "auto" : 0,
              top: tabMenuPosition === "top" ? 0 : "auto",
              backgroundColor: "white"
            }}
            className={classes.tabMenu}
          >
            <Tabs
              className={classes.menuTabs}
              classes={
                classes.menuTabsClasses
                  ? tabMenuPosition === "top"
                    ? `${classes.menuTabsClasses} ${classes.tagTabs}`
                    : classes.menuTabsClasses
                  : undefined
              }
              value={currentRoute || 0}
              onChange={(event, route) => {
                onRouteClick
                  ? onRouteClick(`${routeList[route].url}`)
                  : history.push(`${match.path}${routeList[route].url}`);
              }}
              variant="scrollable"
              indicatorColor="primary"
              textColor="primary"
              centered
              scrollButtons="off"
              aria-label="scrollable force tabs example"
            >
              {routeList.map((route, index) => {
                return (
                  <Tab
                    label={route.name}
                    icon={<Icon>{route.icon}</Icon>}
                    key={index}
                    button
                    className={
                      tabMenuPosition === "top"
                        ? route.type === "button"
                          ? classes.buttonListItem
                          : classes.listItem
                        : classes.tagTab
                    }
                  />
                );
              })}
            </Tabs>
          </AppBar>
        )}
        <AppBar className={classes.menu}>
          <Toolbar className={classes.toolbar}>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              alignContent="center"
            >
              {!hideDrawer && (
                <Grid item>
                  <IconButton
                    aria-label="Open drawer"
                    onClick={() => setOpen(true)}
                    className={classNames(
                      classes.menuButton,
                      open && classes.menuButtonHidden
                    )}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              )}
              <Grid item>
                <img src={logo} width="71px" height="23px" />
              </Grid>
              <Grid item>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="title"
                  noWrap
                  className={classes.title}
                >
                  {brand
                    ? brand
                    : (routeList[currentRoute] &&
                        routeList[currentRoute].name) ||
                      routeList[0].name}
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title={(user && user.name) || ""}>
                  <IconButton
                    aria-owns={isAnchor ? "menu-appbar" : null}
                    aria-haspopup="true"
                    onClick={event => {
                      setAnchorEl(event.currentTarget);
                    }}
                    color="inherit"
                  >
                    <img
                      style={{ borderRadius: "30px" }}
                      src={user && user.image}
                      width={"40px"}
                      height={"auto"}
                      alt="Profile"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  keepMounted
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  open={isAnchor}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    onClick={event => {
                      setMenuOpen(false);
                      onRouteClick
                        ? onRouteClick("/settings")
                        : history.push(`${match.path}settings`);
                    }}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    onClick={event => {
                      setMenuOpen(false);
                      onRouteClick
                        ? onRouteClick("logout")
                        : history.push(`${match.path}auth/login`);
                    }}
                  >
                    Log out
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Divider />
        <Drawer
          className={classes.menu}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Routes
            currentRoute={currentRoute || 0}
            classes={classes}
            routeList={drawerRouteList ? drawerRouteList : routeList}
            isLoggedIn={user && !!user.name}
            onClick={route => {
              setOpen(false);
              if (onDrawerRouteClick) {
                return onDrawerRouteClick(`${route.url}`);
              }
              onRouteClick
                ? onRouteClick(`${route.url}`)
                : history.push(`${match.path}${route.url}`);
            }}
          />
        </Drawer>
        <Paper>
          <main
            style={{
              height: "100vh",
              marginBottom: "100px",
              overflow: "scroll"
            }}
            className={`${classes.hasPadding} ${classes.content}`}
          >
            {render ? render(props) : children}
          </main>
        </Paper>
      </div>
    </>
  );
};

export default compose(enhance)(MainWrapper);
