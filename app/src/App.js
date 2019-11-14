import React from "react";
import { Route, Switch, HashRouter as Router } from "react-router-dom";
import { mainRouteList, shapesFilterRouteList } from "./Routes";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Button,
  CardContent,
  CardActions,
  CardHeader,
  Card,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Avatar,
  Grid,
  Paper,
  Typography
} from "@material-ui/core";
import Swipe from "react-easy-swipe";
import MainWrapper from "./orbital-templates/Material/Wrappers/MainWrapper";
import LoginWrapper from "./orbital-templates/Material/Wrappers/LoginWrapper";
import {
  RegisterWithAuth,
  Media,
  Forms,
  Auth,
  Notification
} from "@markab.io/react";
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
import theme from "./theme";
import { styles } from "Styles";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import { List as VirtualList, AutoSizer } from "react-virtualized";
import Camera from "./Camera/Camera";
import Maps from "./Maps/Maps";
import "./global.css";
import FormsList from "./orbital-templates/Material/_shared/Forms/Forms";
import Loading from "./orbital-templates/Material/_shared/Loading/Loading";
import { Formik } from "formik";
import ModelPreview from "./Knowledge/ModelPreview/ModelPreview";
const loginBG = "";
const registerBG = "";
const logo =
  "https://s3.amazonaws.com/knowledgeflow.markab.io/images/worth-manifesto.png";
const gaTrackingCode = "UA-46023413-2";
const disableAuth = false;
const offlineStorage = {
  getItem: key => {
    return new Promise((resolve, reject) => {
      return resolve(localStorage.getItem(key));
    });
  },
  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      return resolve(localStorage.setItem(key, value));
    });
  },
  removeItem: key => {
    return new Promise((resolve, reject) => {
      return resolve(localStorage.removeItem(key));
    });
  }
};
const tertiary = "#1ABCFE";
const Knowledge = ({
  knowledge,
  knowledge_loading,
  history,
  currentTags,
  setState
}) => {
  return (
    <List style={{ height: "100vh" }}>
      <ListSubheader>{(currentTags && currentTags[0]) || "All"}</ListSubheader>
      <Divider></Divider>
      {knowledge_loading && <Loading />}
      {/* <AutoSizer>
        {({ width, height }) => (
          <VirtualList
            width={500}
            height={height}
            rowCount={knowledge && knowledge.length}
            rowHeight={10}
            rowRenderer={({
              index,
              isScrolling,
              isVisible,
              key,
              parent,
              style
            }) => { */}
      {knowledge.map(({ title, tags }) => {
        return (
          <>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°`}
                  src="https://orbital-clients.s3.amazonaws.com/_Main/Markab-logo-only.svg"
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <a
                    href={`/#/zone/${title}`}
                    onClick={() => history.push(`/zone/${title}`)}
                  >
                    {title}
                  </a>
                }
                secondary={tags.map(t => (
                  <Chip
                    label={t}
                    onClick={() => {
                      setState({
                        tags:
                          currentTags.length === 0
                            ? new Set([t])
                            : currentTags.add(t)
                      });
                    }}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #000000"
                    }}
                  ></Chip>
                ))}
              ></ListItemText>
              <ListItemSecondaryAction>
                <Button
                  onClick={() => history.push(`/zone/${title}`)}
                  color="primary"
                  style={{ padding: "0px" }}
                >
                  <i class="material-icons">arrow_right_alt</i>
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider></Divider>
          </>
        );
      })}
      {/* />
        )}
      </AutoSizer> */}
    </List>
  );
};
class App extends React.Component {
  state = {
    isLoggedIn: true,
    currentUser: {},
    appSettings: {},
    tags: [],
    initialTags: []
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
      .then(res => {
        if (res.data.success === false) {
          this.setState({ isLoggedIn: false });
        } else {
          this.setState({ isLoggedIn: true, currentUser: res.data });
        }
      })
      .catch(err => {
        this.setState({ isLoggedIn: false });
      });
  };
  componentDidMount = () => {
    offlineStorage.getItem("onboardingStep").then(value => {
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
      showConfirmModal: false
    });
  };
  onDialogSave = () => {
    this.props.history.goBack();
    // this.props.celebrate_createModel();
  };
  onSwipeStart(event) {
    // console.log("Start swiping...", event);
  }

  onSwipeMove(position, event) {
    // console.log(`Moved ${position.x} pixels horizontally`, event);
    // console.log(`Moved ${position.y} pixels vertically`, event);
  }

  onSwipeEnd(event) {
    // console.log("End swiping...", event);
  }
  renderDialog = () => {
    return (
      <Dialog
        open={this.state.showConfirmModal}
        onClose={this.onDialogClose}
        aria-labelledby="form-dialog-title"
        fullScreen
      >
        <DialogTitle id="form-dialog-title">Celebrate yourself!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            highlight the clothing items you want to share with other people
          </DialogContentText>
          <img src={this.state.currentImage} />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="What clothing items you want to highlight?"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  render() {
    const { classes } = this.props;
    const logOutRoute = {
      url: "logout",
      name: "Log Out",
      icon: "exit_to_app"
    };
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
                          onSuccess={values => {
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
                path={`${this.props.match.path}onboarding/0`}
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper
                      classes={classes}
                      backgroundImage={registerBG}
                    >
                      <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={(values, actions) => {
                          onSubmit(values)
                            .then(() => {
                              history.push("/");
                              actions.setSubmitting(false);
                            })
                            .catch(err => {
                              actions.setErrors({ server: err });
                              actions.setSubmitting(false);
                            });
                        }}
                        render={({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                          setFieldTouched,
                          ...rest
                        }) => {
                          return (
                            <Card>
                              <CardContent>
                                <img
                                  style={{
                                    display: "block",
                                    marginLeft: "auto",
                                    marginRight: "auto"
                                  }}
                                  src="https://s3.amazonaws.com/knowledgeflow.markab.io/images/worth-manifesto.png"
                                />
                                <Typography style={{ textAlign: "center" }}>
                                  Welcome to Worth Manifesto!
                                </Typography>
                                <Typography style={{ textAlign: "center" }}>
                                  Worth Manifesto is on a mission to acknowledge
                                  the humanity of marginalized women, and you
                                  can help!
                                </Typography>
                                <CardActions
                                  style={{
                                    justifyContent: "center",
                                    flexDirection: "column"
                                  }}
                                >
                                  <div
                                    style={{
                                      marginTop: "2em",
                                      marginBottom: "2em"
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        history.push("/onboarding/1")
                                      }
                                      fullWidth={true}
                                      type="submit"
                                      disabled={isSubmitting}
                                    >
                                      Yes, I want to help
                                    </Button>
                                  </div>
                                </CardActions>
                                <img
                                  style={{
                                    display: "block",
                                    marginLeft: "auto",
                                    marginRight: "auto"
                                  }}
                                  src="https://s3.amazonaws.com/knowledgeflow.markab.io/images/welcome-bottom.png"
                                />
                              </CardContent>
                            </Card>
                          );
                        }}
                      />
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}onboarding/1`}
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper
                      classes={classes}
                      backgroundImage={registerBG}
                    >
                      <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={(values, actions) => {
                          onSubmit(values)
                            .then(() => {
                              history.push("/");
                              actions.setSubmitting(false);
                            })
                            .catch(err => {
                              actions.setErrors({ server: err });
                              actions.setSubmitting(false);
                            });
                        }}
                        render={({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                          setFieldTouched,
                          ...rest
                        }) => {
                          return (
                            <Card>
                              <CardContent>
                                <img
                                  style={{
                                    display: "block",
                                    marginLeft: "auto",
                                    marginRight: "auto"
                                  }}
                                  src="https://s3.amazonaws.com/knowledgeflow.markab.io/images/worth-manifesto.png"
                                />
                                <Typography style={{ textAlign: "center" }}>
                                  Welcome to Worth Manifesto!
                                </Typography>
                                <Typography style={{ textAlign: "center" }}>
                                  Worth Manifesto is on a mission to acknowledge
                                  the humanity of marginalized women, and you
                                  can help!
                                </Typography>
                                <CardActions
                                  style={{
                                    justifyContent: "center",
                                    flexDirection: "column"
                                  }}
                                >
                                  <div
                                    style={{
                                      marginTop: "2em",
                                      marginBottom: "2em"
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() =>
                                        history.push("/auth/register")
                                      }
                                      fullWidth={true}
                                      type="submit"
                                      disabled={isSubmitting}
                                    >
                                      Create an Account
                                    </Button>
                                  </div>
                                  <div>
                                    <Button
                                      style={{
                                        backgroundColor: tertiary
                                      }}
                                      variant="contained"
                                      color="secondary"
                                      fullWidth={true}
                                      onClick={() =>
                                        history.push("/auth/login")
                                      }
                                      type="submit"
                                      disabled={isSubmitting}
                                    >
                                      Log in
                                    </Button>
                                  </div>
                                </CardActions>
                              </CardContent>
                            </Card>
                          );
                        }}
                      />
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}onboarding/2`}
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper
                      classes={classes}
                      backgroundImage={registerBG}
                    >
                      <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={(values, actions) => {
                          onSubmit(values)
                            .then(() => {
                              history.push("/");
                              actions.setSubmitting(false);
                            })
                            .catch(err => {
                              actions.setErrors({ server: err });
                              actions.setSubmitting(false);
                            });
                        }}
                        render={({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                          setFieldTouched,
                          ...rest
                        }) => {
                          return (
                            <Card>
                              <CardContent>
                                <CardActions
                                  style={{ justifyContent: "flex-end" }}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                      this.setState({
                                        currentUser: {
                                          ...this.state.currentUser,
                                          hasSeenTutorial: true
                                        }
                                      });
                                      offlineStorage.setItem(
                                        "onboardingStep",
                                        "3"
                                      );
                                    }}
                                    type="submit"
                                    disabled={isSubmitting}
                                  >
                                    Next
                                  </Button>
                                </CardActions>
                              </CardContent>
                            </Card>
                          );
                        }}
                      />
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}`}
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
                path={`${this.props.match.path}onboarding/agreement`}
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper
                      classes={classes}
                      backgroundImage={registerBG}
                    >
                      <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={(values, actions) => {
                          onSubmit(values)
                            .then(() => {
                              history.push("/");
                              actions.setSubmitting(false);
                            })
                            .catch(err => {
                              actions.setErrors({ server: err });
                              actions.setSubmitting(false);
                            });
                        }}
                        render={({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                          setFieldTouched,
                          ...rest
                        }) => {
                          return (
                            <Card>
                              <CardContent>
                                <CardActions
                                  style={{ justifyContent: "flex-end" }}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                      this.setState({
                                        currentUser: {
                                          ...this.state.currentUser,
                                          hasSeenTutorial: true
                                        }
                                      });
                                      offlineStorage.setItem(
                                        "onboardingStep",
                                        "3"
                                      );
                                    }}
                                    type="submit"
                                    disabled={isSubmitting}
                                  >
                                    Next
                                  </Button>
                                </CardActions>
                              </CardContent>
                            </Card>
                          );
                        }}
                      />
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path={`${this.props.match.path}onboarding/disclaimer`}
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper
                      classes={classes}
                      backgroundImage={registerBG}
                    >
                      <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={(values, actions) => {
                          onSubmit(values)
                            .then(() => {
                              history.push("/");
                              actions.setSubmitting(false);
                            })
                            .catch(err => {
                              actions.setErrors({ server: err });
                              actions.setSubmitting(false);
                            });
                        }}
                        render={({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                          setFieldTouched,
                          ...rest
                        }) => {
                          return (
                            <Card>
                              <CardContent>
                                <CardActions
                                  style={{ justifyContent: "flex-end" }}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                      this.setState({
                                        currentUser: {
                                          ...this.state.currentUser,
                                          hasSeenTutorial: true
                                        }
                                      });
                                      offlineStorage.setItem(
                                        "onboardingStep",
                                        "3"
                                      );
                                    }}
                                    type="submit"
                                    disabled={isSubmitting}
                                  >
                                    Next
                                  </Button>
                                </CardActions>
                              </CardContent>
                            </Card>
                          );
                        }}
                      />
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path="/profile"
                render={({ location, match, history }) => {
                  return (
                    <MainWrapper
                      onRouteClick={route => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return history.push(`${route}`);
                      }}
                      onDrawerRouteClick={route => {
                        if (route === "logout") {
                          return this.onLogout();
                        }
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return history.push(`${route}`);
                      }}
                      isTabMenu={true}
                      drawerRouteList={[...mainRouteList, logOutRoute]}
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
                path="/admin"
                render={({ location, match, history }) => {
                  const routeProps = { location, match, history };
                  console.log("ADMIN!");
                  return (
                    <MainWrapper
                      onRouteClick={route => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return history.push(`${route}`);
                      }}
                      onDrawerRouteClick={route => {
                        if (route === "logout") {
                          return this.onLogout();
                        }
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return history.push(`${route}`);
                      }}
                      isTabMenu={true}
                      drawerRouteList={[...mainRouteList, logOutRoute]}
                      classes={classes}
                      routeList={mainRouteList}
                      location={location}
                      match={match}
                      history={history}
                      hasPadding={true}
                      onLogout={this.onLogout}
                    >
                      <Crud
                        modelName="volunteerings"
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
                                <Admin {...routeProps} />
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
                render={routeProps => {
                  return (
                    <MainWrapper
                      routeList={mainRouteList}
                      onDrawerRouteClick={route => {
                        if (route === "logout") {
                          return this.onLogout();
                        }
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      drawerRouteList={[...mainRouteList, logOutRoute]}
                      {...routeProps}
                      {...this.props}
                      isTabMenu={true}
                      classes={classes}
                      onRouteClick={route => {
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
                path={`${this.props.match.path}timeline`}
                render={routeProps => {
                  return (
                    <MainWrapper
                      routeList={mainRouteList}
                      drawerRouteList={[...mainRouteList, logOutRoute]}
                      onDrawerRouteClick={route => {
                        if (route === "logout") {
                          return this.onLogout();
                        }
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      {...routeProps}
                      {...this.props}
                      isTabMenu={true}
                      onRouteClick={route => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      classes={{
                        ...classes,
                        tabMenu: `${classes["white"]}`,
                        title: `${classes["white"]}`,
                        menuTabsClasses: {
                          flexContainer: `${classes["center"]}`
                        }
                      }}
                    >
                      <Maps {...routeProps} classes={classes}></Maps>
                    </MainWrapper>
                  );
                }}
              ></Route>
              <Route
                path={`${this.props.match.path}experiments`}
                render={routeProps => {
                  return (
                    <MainWrapper
                      routeList={mainRouteList}
                      drawerRouteList={[...mainRouteList, logOutRoute]}
                      onDrawerRouteClick={route => {
                        if (route === "logout") {
                          return this.onLogout();
                        }
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      onRouteClick={route => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      {...routeProps}
                      {...this.props}
                      isTabMenu={true}
                      classes={{
                        ...classes,
                        tabMenu: `${classes["white"]}`,
                        title: `${classes["white"]}`,
                        menuTabsClasses: {
                          flexContainer: `${classes["center"]}`
                        }
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
                            icon: "panorama_fish_eye"
                          },
                          {
                            title: "I want to say something!",
                            icon: "audiotrack"
                          },
                          {
                            title: "I want to write down some thoughts",
                            icon: "edit"
                          }
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
                                          title === "I Saw someting!" ? 20 : 16
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
                      <Route
                        path={`${this.props.match.path}record`}
                        render={routeProps => {
                          return (
                            <Camera
                              onData={data => {
                                this.setState({
                                  currentImage: `data:image/png;base64,${data}`
                                });
                                this.setState({
                                  showConfirmModal: true
                                });
                              }}
                              onError={err => {
                                console.error("ERROR!", err);
                              }}
                              {...props}
                            ></Camera>
                          );
                        }}
                      ></Route>
                      {this.renderDialog()}
                    </MainWrapper>
                  );
                }}
              ></Route>
              <Route
                path={`${this.props.match.path}zone/:zone`}
                render={routeProps => {
                  return (
                    <MainWrapper
                      routeList={mainRouteList}
                      {...routeProps}
                      {...this.props}
                      isTabMenu={true}
                      drawerRouteList={[...mainRouteList, logOutRoute]}
                      onDrawerRouteClick={route => {
                        if (route === "logout") {
                          return this.onLogout();
                        }
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      onRouteClick={route => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      classes={{
                        ...classes,
                        tabMenu: `${classes["white"]}`,
                        title: `${classes["white"]}`,
                        menuTabsClasses: {
                          flexContainer: `${classes["center"]}`
                        }
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
                        query={{
                          tags: [...this.state.tags]
                        }}
                        render={props => {
                          const {
                            knowledge_createModel: createModel,
                            knowledge_updateModel: updateModel,
                            knowledge_deleteModel: deleteModel,
                            knowledge_getModel: getModel,
                            knowledge_searchModel: searchModel,
                            knowledgeSearch
                          } = props;
                          const zone = routeProps.match.params.zone;
                          const knowledge = props.knowledge.find(
                            ({ title }) => title === zone
                          );
                          const modelPreviewProps = {
                            model: knowledge,
                            updateModel,
                            createModel,
                            searchModel,
                            deleteModel,
                            knowledgeSearch,
                            classes,
                            onAdd: () => {},
                            onEdit: () => {},
                            onDelete: () => {},
                            onCreate: () => {},
                            onView: () => {}
                          };
                          return (
                            <div style={{ marginTop: "5em" }}>
                              <ModelPreview
                                {...modelPreviewProps}
                                {...routeProps}
                              />
                            </div>
                          );
                        }}
                      />
                    </MainWrapper>
                  );
                }}
              ></Route>
              <Route
                path={`${this.props.match.path}`}
                render={routeProps => {
                  return (
                    <MainWrapper
                      routeList={mainRouteList}
                      logo={logo}
                      hideDrawer={true}
                      user={this.state.currentUser}
                      {...routeProps}
                      {...this.props}
                      isTabMenu={true}
                      onRouteClick={route => {
                        if (route.indexOf("http") !== -1) {
                          return window.open(route);
                        }
                        return routeProps.history.push(`${route}`);
                      }}
                      classes={{
                        ...classes,
                        tabMenu: `${classes["white"]}`,
                        menuTabsClasses: {
                          flexContainer: `${classes["center"]}`
                        }
                      }}
                      render={currentProps => (
                        <MainWrapper
                          logo={logo}
                          brand={"Locations"}
                          hideDrawer={true}
                          user={this.state.currentUser}
                          routeList={shapesFilterRouteList}
                          isTabMenu={true}
                          tabMenuPosition="top"
                          {...routeProps}
                          {...this.props}
                          onRouteClick={route => {
                            this.setState({
                              tags:
                                this.state.tags.length === 0
                                  ? new Set([route.replace("/", "")])
                                  : this.state.tags.add(route.replace("/", ""))
                            });
                          }}
                          onDrawerRouteClick={route => {
                            if (route === "logout") {
                              return this.onLogout();
                            }
                            if (route.indexOf("http") !== -1) {
                              return window.open(route);
                            }
                            return routeProps.history.push(`${route}`);
                          }}
                          drawerRouteList={[...mainRouteList, logOutRoute]}
                          classes={{
                            ...classes,
                            tabMenu: `${classes["white"]} ${classes["relative"]} ${classes["top50"]}`
                          }}
                        >
                          <Switch>
                            <Route
                              path={`${routeProps.match.path}`}
                              render={props => {
                                return (
                                  <Crud
                                    modelName="knowledge"
                                    SERVER={config.SERVER}
                                    offlineStorage={offlineStorage}
                                    notificationDomainStore={
                                      rootStore.notificationDomainStore
                                    }
                                    crudDomainStore={rootStore.crudDomainStore}
                                    query={{
                                      tags: [...this.state.tags]
                                    }}
                                    render={props => {
                                      const filteredKnowledge =
                                        [...this.state.tags].length > 0
                                          ? props.knowledge
                                              .map(k => {
                                                const res = k.tags.find(
                                                  t =>
                                                    [
                                                      ...this.state.tags
                                                    ].indexOf(t) !== -1
                                                );
                                                if (res) {
                                                  return k;
                                                }
                                                return undefined;
                                              })
                                              .filter(
                                                know => know !== undefined
                                              )
                                          : props.knowledge;
                                      return (
                                        <>
                                          <Swipe
                                            onSwipeStart={this.onSwipeStart}
                                            onSwipeMove={this.onSwipeMove}
                                            onSwipeEnd={this.onSwipeEnd}
                                          >
                                            <Paper>
                                              <Maps
                                                {...routeProps}
                                                classes={classes}
                                              ></Maps>
                                            </Paper>
                                          </Swipe>
                                          <div style={{ marginTop: "67px" }}>
                                            <img
                                              src={
                                                "https://s3.amazonaws.com/knowledgeflow.markab.io/images/Rectangle+5.png"
                                              }
                                              width="100px"
                                              height="10px"
                                              style={{
                                                display: "block",
                                                marginLeft: "auto",
                                                marginRight: "auto"
                                              }}
                                            />
                                          </div>
                                          {[...this.state.tags].map(tag => (
                                            <Chip
                                              label={tag}
                                              key={tag}
                                              id={tag}
                                              onDelete={() =>
                                                this.setState({
                                                  tags: new Set(
                                                    [...this.state.tags].filter(
                                                      t => t !== tag
                                                    )
                                                  )
                                                })
                                              }
                                            />
                                          ))}
                                          <Knowledge
                                            {...routeProps}
                                            {...props}
                                            currentTags={this.state.tags}
                                            setState={props =>
                                              this.setState(props)
                                            }
                                            knowledge={filteredKnowledge}
                                          />
                                        </>
                                      );
                                    }}
                                  />
                                );
                              }}
                            ></Route>
                          </Switch>
                        </MainWrapper>
                      )}
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
