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
import Physics from "./Physics/Physics";
import theme from "./theme";
import { styles } from "Styles";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import Camera from "./Camera/Camera";
import "./global.css";
import { Formik } from "formik";
import Knowledge from "./Knowledge/Knowledge";
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
                            .catch((err) => {
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
                                    marginRight: "auto",
                                  }}
                                  src="https://s3.amazonaws.com/worthmanifesto.markab.io/images/worth_manifesto-words.jpg"
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
                                    flexDirection: "column",
                                  }}
                                >
                                  <div
                                    style={{
                                      marginTop: "2em",
                                      marginBottom: "2em",
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
                                    marginRight: "auto",
                                  }}
                                  src="https://s3.amazonaws.com/worthmanifesto.markab.io/images/welcome-bottom.png"
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
                            .catch((err) => {
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
                                    marginRight: "auto",
                                  }}
                                  src="https://s3.amazonaws.com/worthmanifesto.markab.io/images/worth-manifesto.png"
                                />
                                <Typography style={{ textAlign: "center" }}>
                                  Welcome to Worth Manifesto!
                                </Typography>
                                <Typography style={{ textAlign: "center" }}>
                                  Volunteer Waiver
                                </Typography>
                                <Typography>
                                  I, _______________________________________
                                  (please PRINT name), being ⎕ over 18 years of
                                  age and competent ⎕ under 18 years of age,
                                  have agreed to act as a volunteer for Worth
                                  Manifesto, a non-profit organization, in its
                                  charitable endeavors to help marginalized
                                  women, specifically homeless and displaced at
                                  the border. I understand that any act I do is
                                  done by me entirely as a volunteer, rather
                                  than as an agent, employee, or independent
                                  contractor of Worth Manifesto. I agree that I
                                  will not look to Worth Manifesto for my
                                  personal safety measures even when performing
                                  tasks while I am acting as a volunteer. I
                                  waive any right to make a claim against Worth
                                  Manifesto for any injury, personal or
                                  otherwise, that I may suffer when I am acting
                                  as a volunteer. I agree to defend fully and to
                                  indemnify Worth Manifesto in any claim that
                                  may be made against it for any injury,
                                  personal or otherwise, arising from my
                                  volunteer activities. I consent and authorize
                                  Worth Manifesto to use and reproduce in any
                                  form, style or color, together with any
                                  writing, any photographs or other likeness of
                                  me taken in my capacity as a volunteer and
                                  circulated for the purposes of Worth
                                  Manifesto. This consent and release is given
                                  without limitation upon any internal or
                                  external use for advertising, promotion,
                                  illustration, or any other purpose, in print
                                  publication, audio-visual presentation,
                                  digital or electronic media or any other
                                  medium. I further waive any right to inspect
                                  or approve the commercial, advertising or
                                  other materials. I agree that such photograph
                                  or likeness remains the exclusive property of
                                  Worth Manifesto. Additionally, I waive any
                                  right to royalties or other compensation
                                  arising or related to the use of the
                                  photograph.
                                </Typography>
                                <CardActions
                                  style={{
                                    justifyContent: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div
                                    style={{
                                      marginTop: "2em",
                                      marginBottom: "2em",
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
                                        backgroundColor: tertiary,
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
                            .catch((err) => {
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
                                Notifications
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
                                          hasSeenTutorial: true,
                                        },
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
                            .catch((err) => {
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
                                          hasSeenTutorial: true,
                                        },
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
                            .catch((err) => {
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
                                          hasSeenTutorial: true,
                                        },
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
                      // isTabMenu={true}
                      classes={classes}
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
                path={`${this.props.match.path}info`}
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
                          {
                            title: `Social Media Links
                                    @worthmanifesto
                                    [On Facebook, twitter, instagram, linkedin]
                                    Facebook group https://www.facebook.com/groups/worthmanifesto/`,
                            icon: "edit",
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
                      <Route
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
                      ></Route>
                    </MainWrapper>
                  );
                }}
              ></Route>
              <Route
                path={`${this.props.match.path}simulations`}
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
                        hasPadding: `${classes["top50"]} ${classes["bottom50"]}`,
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
                              const mainFilter = props.location.pathname;
                              return (
                                <Crud
                                  modelName="knowledge"
                                  SERVER={config.SERVER}
                                  offlineStorage={offlineStorage}
                                  notificationDomainStore={
                                    rootStore.notificationDomainStore
                                  }
                                  paginate={true}
                                  crudDomainStore={rootStore.crudDomainStore}
                                  query={{
                                    tags: [...this.state.tags],
                                  }}
                                  render={(props) => {
                                    return (
                                      <Physics
                                        {...routeProps}
                                        {...props}
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
              <Route
                path={`${this.props.match.path}`}
                render={(routeProps) => {
                  return (
                    <Switch>
                      <Route
                        path={`${routeProps.match.path}`}
                        render={(props) => {
                          return (
                            <Forms
                              formsDomainStore={rootStore.formsDomainStore}
                              modelName="knowledge"
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
                                  tags: [...this.state.tags],
                                }}
                                paginate={true}
                                render={(props) => {
                                  return (
                                    <MainWrapper
                                      logo={logo}
                                      routeList={mainFilterRouteList}
                                      drawerRouteList={
                                        this.state.currentUser &&
                                        this.state.currentUser.isAdmin
                                          ? [
                                              ...mainRouteList,
                                              adminRoute,
                                              logoutRoute,
                                            ]
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
                                        return routeProps.history.push(
                                          `${route}`
                                        );
                                      }}
                                      classes={{
                                        ...classes,
                                        tabMenu: `${classes["white"]}`,
                                        listContainer: `${classes["top100"]}`,
                                        menuTabsClasses: {
                                          flexContainer: `${classes["center"]}`,
                                        },
                                      }}
                                    >
                                      <Knowledge
                                        {...routeProps}
                                        {...props}
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
                                    </MainWrapper>
                                  );
                                }}
                              />
                            </Forms>
                          );
                        }}
                      ></Route>
                    </Switch>
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
