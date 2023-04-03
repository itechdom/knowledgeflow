import React from "react";
import { Route, Switch, HashRouter as Router } from "react-router-dom";
import {
  mainRouteList,
  mainFilterRouteList,
  editableSchemas,
  adminRoute,
  logoutRoute,
} from "./Routes";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CardContent,
  CardActions,
  CardHeader,
  Card,
  Grid,
  Typography,
} from "@material-ui/core";
import MainWrapper from "./orbital-templates/Material/Wrappers/MainWrapper";
import LoginWrapper from "./orbital-templates/Material/Wrappers/LoginWrapper";
import {
  RegisterWithAuth,
  Media,
  Forms,
  Auth,
  Notification,
} from "@markab.io/react";
import { Wikipedia } from "../react-services/wikipedia-service/wikipedia-service";
import { LoginWithAuth } from "../react-services/auth-service/auth-service";
import { Crud } from "../react-services/crud-service/crud-service-mst";
import config from "Config";
import ReactGA from "react-ga";
import rootStore from "./Store/rootStore";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Profile from "./Profile/Profile";
import Admin from "./Admin/Admin";
import World from "./World/World";
import theme from "./theme";
import { styles } from "Styles";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import Camera from "./Camera/Camera";
import "./global.css";
import { Formik } from "formik";
import Loading from "./orbital-templates/Material/_shared/Loading/Loading";
import Knowledge from "./Knowledge/Knowledge";
import KnowledgePreview from "./Knowledge/ModelPreview/ModelPreview";
const loginBG = "";
const registerBG = "";
const logo = "https://orbital-clients.s3.amazonaws.com/_Main/Markab-KB.svg";
const gaTrackingCode = "UA-46023413-2";
const disableAuth = true;
const offlineStorage = {
  getItem: (key) => {
    return new Promise((resolve, reject) => {
      return resolve(localStorage.getItem(key));
    });
  },
  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      return resolve(localStorage.setItem(key, value));
    });
  },
  removeItem: (key) => {
    return new Promise((resolve, reject) => {
      return resolve(localStorage.removeItem(key));
    });
  },
};
const tertiary = "#1ABCFE";
const Logout = ({ onLogout }) => {
  React.useEffect(() => {
    onLogout();
  }, []);
  return <></>;
};
class App extends React.Component {
  state = {
    isLoggedIn: true,
    currentUser: {},
    appSettings: {},
    tags: [],
    initialTags: [],
    mainRouteState: {},
    expandMap: true,
    selected: null,
  };
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (!disableAuth) {
        !disableAuth && this.onRouteChanged();
      }
    }
  }
  onRouteChanged = () => {
    gaTrackingCode && ReactGA.pageview(this.props.location.pathname);
    rootStore.authDomainStore
      .isAuthenticated()
      .then((res) => {
        if (res.data.success === false) {
          this.setState({ isLoggedIn: false });
        } else {
          this.setState({ isLoggedIn: true, currentUser: res.data });
        }
      })
      .catch((err) => {
        this.setState({ isLoggedIn: false });
      });
  };
  componentDidMount = () => {
    offlineStorage.getItem("onboardingStep").then((value) => {
      if (value !== "final") {
        return this.props.history(`/onboarding/${value}`);
      }
    });
    !disableAuth && this.onRouteChanged();
  };
  onLogout() {
    rootStore.authDomainStore.logout();
    this.setState({ isLoggedIn: false });
  }
  onDialogClose = () => {
    this.props.history.goBack();
    return this.setState({
      showConfirmModal: false,
    });
  };
  onDialogSave = () => {
    this.props.history.goBack();
    // this.props.celebrate_createModel();
  };
  renderDialog = ({ title, message, yes, no, onYes, onNo, extra }) => {
    return (
      <Dialog
        open={true}
        onClose={onNo}
        aria-labelledby="form-dialog-title"
        fullScreen
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
          <DialogContentText>{extra ? extra : <></>}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onNo} variant="outlined" color="primary">
            {no}
          </Button>
          <Button onClick={onYes} variant="contained" color="secondary">
            {yes}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Router>
          {!disableAuth && !this.state.isLoggedIn ? (
            <Switch>
              <Route
                path="/auth/forgot-password"
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper
                      classes={classes}
                      backgroundImage={registerBG}
                    >
                      <Auth authDomainStore={rootStore.authDomainStore}>
                        <ForgotPassword
                          onLogin={() => history.push("/auth/login")}
                          location={location}
                          history={history}
                          match={match}
                          classes={classes}
                        />
                      </Auth>
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path="/auth/reset-password"
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper
                      classes={classes}
                      backgroundImage={registerBG}
                    >
                      <Auth authDomainStore={rootStore.authDomainStore}>
                        <ResetPassword
                          onLogin={() => history.push("/auth/login")}
                          location={location}
                          history={history}
                          match={match}
                          classes={classes}
                        />
                      </Auth>
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path="/auth/login"
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper classes={classes} backgroundImage={loginBG}>
                      <LoginWithAuth
                        authUiStore={rootStore.authUiStore}
                        authDomainStore={rootStore.authDomainStore}
                        classes={classes}
                      >
                        <Login
                          onRegister={() => history.push("/auth/register")}
                          onForgotPassword={() =>
                            history.push("/auth/forgot-password")
                          }
                          onSuccess={(values) => {
                            this.setState({ isLoggedIn: true });
                          }}
                          location={location}
                          history={history}
                          match={match}
                        />
                      </LoginWithAuth>
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}knowledge`}
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper
                      classes={classes}
                      backgroundImage={registerBG}
                    >
                      <RegisterWithAuth
                        authDomainStore={rootStore.authDomainStore}
                        authUiStore={rootStore.authUiStore}
                      >
                        {!this.state.isLoggedIn && (
                          <Register
                            onLogin={() => history.push("/auth/login")}
                            onSuccess={() => history.push("/onboarding/1")}
                            location={location}
                            history={history}
                            match={match}
                            classes={classes}
                          />
                        )}
                      </RegisterWithAuth>
                    </LoginWrapper>
                  );
                }}
              />
            </Switch>
          ) : (
            <Switch>
              <Route
                path="/profile"
                render={({ location, match, history }) => {
                  return (
                    <MainWrapper
                      onRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return history.push(`${route}`);
                      }}
                      onDrawerRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return history.push(`${route}`);
                      }}
                      isTabMenu={true}
                      drawerRouteList={[...mainRouteList, logoutRoute]}
                      classes={classes}
                      routeList={mainRouteList}
                      location={location}
                      match={match}
                      history={history}
                      hasPadding={true}
                      onLogout={this.onLogout}
                    >
                      <Crud
                        modelName="users"
                        SERVER={config.SERVER}
                        offlineStorage={offlineStorage}
                        notificationDomainStore={
                          rootStore.notificationDomainStore
                        }
                        crudDomainStore={rootStore.crudDomainStore}
                      >
                        <Forms formsDomainStore={rootStore.formsDomainStore}>
                          <Media
                            extension="image/jpg"
                            mediaDomainStore={rootStore.mediaDomainStore}
                          >
                            <Notification
                              notificationDomainStore={
                                rootStore.notificationDomainStore
                              }
                            >
                              <Profile
                                user={this.state.currentUser}
                                formsDomainStore={rootStore.formsDomainStore}
                                location={location}
                                match={match}
                                history={history}
                              />
                            </Notification>
                          </Media>
                        </Forms>
                      </Crud>
                    </MainWrapper>
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}logout`}
                render={({ location, match, history }) => {
                  const routeProps = { location, match, history };
                  return (
                    <Logout {...routeProps} onLogout={() => this.onLogout()} />
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}admin`}
                render={({ location, match, history }) => {
                  const routeProps = { location, match, history };
                  return (
                    <MainWrapper
                      onRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return history.push(`${route}`);
                      }}
                      onDrawerRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return history.push(`${route}`);
                      }}
                      routeList={
                        this.state.currentUser && this.state.currentUser.isAdmin
                          ? [...mainRouteList, adminRoute]
                          : [...mainRouteList]
                      }
                      drawerRouteList={
                        this.state.currentUser && this.state.currentUser.isAdmin
                          ? [...mainRouteList, adminRoute, logoutRoute]
                          : [...mainRouteList, logoutRoute]
                      }
                      location={location}
                      match={match}
                      logo={logo}
                      history={history}
                      hasPadding={true}
                      onLogout={this.onLogout}
                      classes={{
                        ...classes,
                        tabMenu: `${classes["white"]}`,
                        hasPadding: `${classes["top50"]} ${classes["bottom50"]}`,
                        title: `${classes["white"]}`,
                        addButton: `${classes["bold"]}`,
                        menuTabsClasses: {
                          flexContainer: `${classes["center"]}`,
                        },
                      }}
                    >
                      <Crud
                        modelName="knowledge"
                        SERVER={config.SERVER}
                        offlineStorage={offlineStorage}
                        notificationDomainStore={
                          rootStore.notificationDomainStore
                        }
                        crudDomainStore={rootStore.crudDomainStore}
                      >
                        <Crud
                          modelName="users"
                          SERVER={config.SERVER}
                          offlineStorage={offlineStorage}
                          notificationDomainStore={
                            rootStore.notificationDomainStore
                          }
                          crudDomainStore={rootStore.crudDomainStore}
                        >
                          <Forms
                            modelName="knowledge"
                            formsDomainStore={rootStore.formsDomainStore}
                          >
                            <Media
                              extension="image/jpg"
                              mediaDomainStore={rootStore.mediaDomainStore}
                            >
                              <Notification
                                notificationDomainStore={
                                  rootStore.notificationDomainStore
                                }
                              >
                                <Admin
                                  classes={classes}
                                  schemas={editableSchemas}
                                  {...routeProps}
                                />
                              </Notification>
                            </Media>
                          </Forms>
                        </Crud>
                      </Crud>
                    </MainWrapper>
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}me`}
                render={(routeProps) => {
                  return (
                    <MainWrapper
                      routeList={mainRouteList}
                      onDrawerRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      drawerRouteList={
                        this.state.currentUser && this.state.currentUser.isAdmin
                          ? [...mainRouteList, adminRoute, logoutRoute]
                          : [...mainRouteList, logoutRoute]
                      }
                      {...routeProps}
                      {...this.props}
                      isTabMenu={true}
                      classes={classes}
                      onRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                    >
                      <Profile {...routeProps}></Profile>
                    </MainWrapper>
                  );
                }}
              ></Route>
              <Route
                path={`${this.props.match.path}record`}
                render={(routeProps) => {
                  return (
                    <MainWrapper
                      routeList={
                        this.state.currentUser && this.state.currentUser.isAdmin
                          ? [...mainRouteList, adminRoute]
                          : [...mainRouteList]
                      }
                      drawerRouteList={
                        this.state.currentUser && this.state.currentUser.isAdmin
                          ? [...mainRouteList, adminRoute, logoutRoute]
                          : [...mainRouteList, logoutRoute]
                      }
                      onDrawerRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      onRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      logo={logo}
                      {...routeProps}
                      {...this.props}
                      isTabMenu={true}
                      classes={{
                        ...classes,
                        tabMenu: `${classes["white"]}`,
                        hasPadding: `${classes["top50"]} ${classes["bottom50"]}`,
                        title: `${classes["white"]}`,
                        menuTabsClasses: {
                          flexContainer: `${classes["center"]}`,
                        },
                      }}
                    >
                      <Grid
                        style={{ marginTop: "6em", height: "100vh" }}
                        container
                        justify="center"
                      >
                        {[
                          {
                            title: "I Saw someting!",
                            icon: "panorama_fish_eye",
                          },
                          {
                            title: "I want to say something!",
                            icon: "audiotrack",
                          },
                        ].map(({ title, icon }) => (
                          <Grid xs={12} md={6} item>
                            <Card>
                              <Grid container justify="center">
                                <Grid item xs={6} md={6}>
                                  <CardContent style={{ textAlign: "center" }}>
                                    <Button color="primary" variant="contained">
                                      <i class="material-icons">{icon}</i>
                                    </Button>
                                    <p
                                      style={{
                                        fontWeight: "bold",
                                        fontSize:
                                          title === "I Saw someting!" ? 20 : 16,
                                      }}
                                    >
                                      {title}
                                    </p>
                                  </CardContent>
                                </Grid>
                              </Grid>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                      {/* <Route
                        path={`${this.props.match.path}record`}
                        render={(routeProps) => {
                          return (
                            <Camera
                              onData={(data) => {
                                this.setState({
                                  currentImage: `data:image/png;base64,${data}`,
                                });
                                this.setState({
                                  showConfirmModal: true,
                                });
                              }}
                              onError={(err) => {
                                console.error("ERROR!", err);
                              }}
                              {...props}
                            ></Camera>
                          );
                        }}
                      ></Route> */}
                    </MainWrapper>
                  );
                }}
              ></Route>
               <Route
                path={`${this.props.match.path}knowledge/view/:id`}
                render={(routeProps) => {
                  const {
                    match: { params },
                  } = routeProps;
                  let query = { _id: params.id };
                  return (
                    <Crud
                      modelName="knowledge"
                      SERVER={config.SERVER}
                      offlineStorage={offlineStorage}
                      notificationDomainStore={
                        rootStore.notificationDomainStore
                      }
                      crudDomainStore={rootStore.crudDomainStore}
                      paginate={false}
                      query={query}
                      render={(props) => {
                        // console.log(
                        //   "PROPS",
                        //   props.knowledge_undoManager.history
                        // );
                        let knowledge =
                          props.knowledge_queryResult &&
                          props.knowledge_queryResult.data &&
                          props.knowledge_queryResult.data[0];
                        if (!knowledge || props.knowledge_loading) {
                          return <Loading></Loading>;
                        }
                        return (
                          <MainWrapper
                            logo={logo}
                            routeList={[
                              {
                                url: "all",
                                name: "All",
                                icon: "",
                              },
                            ]}
                            drawerRouteList={
                              this.state.currentUser &&
                              this.state.currentUser.isAdmin
                                ? [...mainRouteList, adminRoute, logoutRoute]
                                : [...mainRouteList, logoutRoute]
                            }
                            user={this.state.currentUser}
                            {...routeProps}
                            {...this.props}
                            onRouteClick={(route) => {
                              this.setState({
                                tags: new Set([]),
                              });
                              if (route.indexOf("http") !== -1) {
                                return window.open(route);
                              }
                              return routeProps.history.push(`${route}`);
                            }}
                            classes={{
                              ...classes,
                              tabMenu: `${classes["white"]}`,
                              menuTabsClasses: {
                                flexContainer: `${classes["center"]}`,
                              },
                            }}
                          >
                            <Wikipedia
                              SERVER={config.SERVER}
                              offlineStorage={offlineStorage}
                              notificationDomainStore={
                                rootStore.notificationDomainStore
                              }
                            >
                              <KnowledgePreview
                                onEdit={(model) => {
                                  routeProps.history.push(
                                    `//edit/${model._id}`
                                  );
                                }}
                                onDelete={() => {
                                  routeProps.history.goBack();
                                }}
                                classes={classes}
                                location={this.props.location}
                                currentTags={this.state.tags}
                                selected={this.state.selected}
                                currentUser={this.state.currentUser}
                                setState={(props) => this.setState(props)}
                                model={knowledge}
                                knowledge_updateModel={
                                  props.knowledge_updateModel
                                }
                                knowledge_deleteModel={
                                  props.knowledge_deleteModel
                                }
                                renderDialog={(props) =>
                                  this.renderDialog(props)
                                }
                              />
                            </Wikipedia>
                          </MainWrapper>
                        );
                      }}
                    />
                  );
                }}
              />
               <Route
                path={`${this.props.match.path}knowledge`}
                render={(routeProps) => {
                  const {
                    match: { params },
                  } = routeProps;
                  let query = { _id: params.id };
                  return (
                    <Crud
                      modelName="knowledge"
                      SERVER={config.SERVER}
                      offlineStorage={offlineStorage}
                      notificationDomainStore={
                        rootStore.notificationDomainStore
                      }
                      crudDomainStore={rootStore.crudDomainStore}
                      paginate={false}
                      query={query}
                      render={(props) => {
                        // console.log(
                        //   "PROPS",
                        //   props.knowledge_undoManager.history
                        // );
                        let knowledge =
                          props.knowledge_queryResult 
                          
                        if (!knowledge || props.knowledge_loading) {
                          return <Loading></Loading>;
                        }
                        return (
                          <MainWrapper
                            logo={logo}
                            routeList={[
                              {
                                url: "all",
                                name: "All",
                                icon: "",
                              },
                            ]}
                            drawerRouteList={
                              this.state.currentUser &&
                              this.state.currentUser.isAdmin
                                ? [...mainRouteList, adminRoute, logoutRoute]
                                : [...mainRouteList, logoutRoute]
                            }
                            user={this.state.currentUser}
                            {...routeProps}
                            {...this.props}
                            onRouteClick={(route) => {
                              this.setState({
                                tags: new Set([]),
                              });
                              if (route.indexOf("http") !== -1) {
                                return window.open(route);
                              }
                              return routeProps.history.push(`${route}`);
                            }}
                            classes={{
                              ...classes,
                              tabMenu: `${classes["white"]}`,
                              menuTabsClasses: {
                                flexContainer: `${classes["center"]}`,
                              },
                            }}
                          >
                            <Wikipedia
                              SERVER={config.SERVER}
                              offlineStorage={offlineStorage}
                              notificationDomainStore={
                                rootStore.notificationDomainStore
                              }
                            >
                              <Knowledge
                                onEdit={(model) => {
                                  routeProps.history.push(
                                    `//edit/${model._id}`
                                  );
                                }}
                                onDelete={() => {
                                  routeProps.history.goBack();
                                }}
                                match={routeProps.match}
                                classes={classes}
                                location={this.props.location}
                                currentTags={this.state.tags}
                                selected={this.state.selected}
                                currentUser={this.state.currentUser}
                                setState={(props) => this.setState(props)}
                                model={knowledge}
                                knowledge={knowledge}
                                knowledge_updateModel={
                                  props.knowledge_updateModel
                                }
                                knowledge_deleteModel={
                                  props.knowledge_deleteModel
                                }
                                renderDialog={(props) =>
                                  this.renderDialog(props)
                                }
                              />
                            </Wikipedia>
                          </MainWrapper>
                        );
                      }}
                    />
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}`}
                render={(routeProps) => {
                  return (
                    <MainWrapper
                      logo={logo}
                      user={this.state.currentUser}
                      {...routeProps}
                      {...this.props}
                      routeList={
                        this.state.currentUser && this.state.currentUser.isAdmin
                          ? [...mainRouteList, adminRoute]
                          : [...mainRouteList]
                      }
                      drawerRouteList={
                        this.state.currentUser && this.state.currentUser.isAdmin
                          ? [...mainRouteList, adminRoute, logoutRoute]
                          : [...mainRouteList, logoutRoute]
                      }
                      onRouteClick={(route) => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      classes={{
                        ...classes,
                        tabMenu: `${classes["white"]}`,
                        content: `${classes.noScroll}`,
                        menuTabsClasses: {
                          flexContainer: `${classes["center"]}`,
                        },
                      }}
                      render={(currentProps) => (
                        <Switch>
                          <Route
                            path={`${routeProps.match.path}`}
                            render={(props) => {
                              return (
                                <Crud
                                  modelName="knowledge"
                                  SERVER={config.SERVER}
                                  offlineStorage={offlineStorage}
                                  notificationDomainStore={
                                    rootStore.notificationDomainStore
                                  }
                                  crudDomainStore={rootStore.crudDomainStore}
                                  render={(props) => {
                                    return (
                                      <World
                                        location={this.props.location}
                                        currentTags={this.state.tags}
                                        selected={this.state.selected}
                                        currentUser={this.state.currentUser}
                                        setState={(props) =>
                                          this.setState(props)
                                        }
                                        renderDialog={(props) =>
                                          this.renderDialog(props)
                                        }
                                        knowledge={props.knowledge}
                                      />
                                    );
                                  }}
                                />
                              );
                            }}
                          ></Route>
                        </Switch>
                      )}
                    />
                  );
                }}
              />
              {/* View knowledge, since it's an independent page */}
              <Route
                path={`${this.props.match.path}:tag?`}
                render={(routeProps) => {
                  let tag = routeProps.match.params.tag;
                  return (
                    <Crud
                      modelName="knowledge"
                      SERVER={config.SERVER}
                      offlineStorage={offlineStorage}
                      notificationDomainStore={
                        rootStore.notificationDomainStore
                      }
                      crudDomainStore={rootStore.crudDomainStore}
                      paginate={true}
                      query={{}}
                      render={(props) => {
                        let knowledge = props.knowledge;
                        let filteredRoutes = [];
                        if (props.knowledge && props.knowledge.data) {
                          let routes = props.knowledge.data
                            .map((kn) => kn.tags)
                            .map((t) => {
                              const routes = t.map((tag) => {
                                return { url: tag, name: tag, icon: "" };
                              });
                              return routes;
                            });
                          const newRoutes = Array.isArray(routes)
                            ? routes.reduce((prev, cur) => {
                                return [...prev, ...cur];
                              }, [])
                            : [];
                          filteredRoutes = newRoutes.filter((r, i) => {
                            return (
                              newRoutes.map((ro) => ro.name).indexOf(r.name) ===
                              i
                            );
                          });
                          filteredRoutes = [
                            { url: "", name: "All", icon: "" },
                            ...filteredRoutes,
                          ];
                        }
                        if (tag) {
                          knowledge =
                            props.knowledge && props.knowledge.data
                              ? {
                                  data: props.knowledge.data.filter(
                                    (k) => k.tags.indexOf(tag) !== -1
                                  ),
                                  count: props.knowledge.count,
                                }
                              : props.knowledge;
                        }
                        return (
                          <MainWrapper
                            logo={logo}
                            routeList={[
                              {
                                url: "all",
                                name: "All",
                                icon: "",
                              },
                            ]}
                            drawerRouteList={
                              this.state.currentUser &&
                              this.state.currentUser.isAdmin
                                ? [...mainRouteList, adminRoute, logoutRoute]
                                : [...mainRouteList, logoutRoute]
                            }
                            user={this.state.currentUser}
                            {...routeProps}
                            {...this.props}
                            onRouteClick={(route) => {
                              this.setState({
                                tags: new Set([]),
                              });
                              if (route.indexOf("http") !== -1) {
                                return window.open(route);
                              }
                              return routeProps.history.push(`${route}`);
                            }}
                            classes={{
                              ...classes,
                              tabMenu: `${classes["white"]}`,
                              menuTabsClasses: {
                                flexContainer: `${classes["center"]}`,
                              },
                            }}
                          >
                            <MainWrapper
                              isTabMenu={true}
                              hideAppBar={true}
                              logo={logo}
                              routeList={filteredRoutes}
                              drawerRouteList={
                                this.state.currentUser &&
                                this.state.currentUser.isAdmin
                                  ? [...mainRouteList, adminRoute, logoutRoute]
                                  : [...mainRouteList, logoutRoute]
                              }
                              user={this.state.currentUser}
                              {...routeProps}
                              {...this.props}
                              length={[]}
                              onRouteClick={(route) => {
                                return routeProps.history.push({
                                  pathname: `${this.props.match.path}${route}`,
                                });
                              }}
                              tabMenuPosition="top"
                              classes={{
                                ...classes,
                                listContainer: `${classes["top100"]}`,
                                menuTabsClasses: {
                                  flexContainer: `${classes["center"]}`,
                                },
                              }}
                            >
                              <Forms
                                formsDomainStore={rootStore.formsDomainStore}
                                modelName="knowledge"
                              >
                                <Wikipedia
                                  SERVER={config.SERVER}
                                  offlineStorage={offlineStorage}
                                  notificationDomainStore={
                                    rootStore.notificationDomainStore
                                  }
                                >
                                  {/* <Grid
                                    container
                                    justify="center"
                                    style={{ marginBottom: "5em" }}
                                  >
                                    <Grid
                                      item
                                      style={{
                                        borderRadius: "150px",
                                        background: "white",
                                        boxShadow: "black 0px 1px 3px",
                                        padding: "3em",
                                      }}
                                    >
                                      <Typography variant="h4" component="h1">
                                        {JSON.stringify(this.state.currentUser)}
                                        's Knowledge
                                      </Typography>
                                    </Grid>
                                  </Grid> */}
                                  <Knowledge
                                    {...routeProps}
                                    {...props}
                                    location={this.props.location}
                                    currentTags={this.state.tags}
                                    selected={this.state.selected}
                                    currentUser={this.state.currentUser}
                                    setState={(props) => this.setState(props)}
                                    renderDialog={(props) =>
                                      this.renderDialog(props)
                                    }
                                    knowledge={knowledge}
                                  />
                                </Wikipedia>
                              </Forms>
                            </MainWrapper>
                          </MainWrapper>
                        );
                      }}
                    />
                  );
                }}
              />
            </Switch>
          )}
        </Router>
      </ThemeProvider>
    );
  }
  componentWillReceiveProps(nextProps) {}
}
export default withStyles(styles, { defaultTheme: theme })(App);
