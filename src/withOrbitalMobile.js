import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import routeListLoggedOut from "./Routes";
import {
  LoginWithAuth,
  RegisterWithAuth,
  Media,
  Forms,
  Auth,
  Notification,
  Crud
} from "@markab.io/react";
import config from "Config";
import ReactGA from "react-ga";
import { compose } from "recompose";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import { styles } from "Styles";
// import MainWrapper from "./orbital-templates/Material/Wrappers/MainWrapper";
// import LoginWrapper from "./orbital-templates/Material/Wrappers/LoginWrapper";
import theme from "Theme";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";
import Register from "./Register/Register";
import NotFound from "./NotFound/NotFound";
import Login from "./Login/Login";
import Profile from "./Profile/Profile";
import NotificationPage from "./Notification/Notification";

const withOrbitalMobile = ({
  loginBG,
  registerBG,
  routeList,
  rootStore,
  logo,
  gaTrackingCode,
  disableAuth,
  offlineStorage
}) => WrappedComponent => {
  class WithOrbital extends React.Component {
    state = {
      isLoggedIn: false,
      currentUser: {},
      appSettings: {}
    };
    constructor(props) {
      super(props);
      this.onLogout = this.onLogout.bind(this);
    }
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        this.onRouteChanged();
      }
    }
    onRouteChanged() {
      gaTrackingCode && ReactGA.pageview(this.props.location.pathname);
      if (
        !disableAuth &&
        this.props.location.pathname.indexOf("/auth") === -1
      ) {
        rootStore.authDomainStore
          .isAuthenticated()
          .then(res => {
            if (res.status !== 200) {
              this.setState({ isLoggedIn: false });
            } else {
              this.setState({ isLoggedIn: true, currentUser: res.data });
            }
          })
          .catch(err => {
            this.setState({ isLoggedIn: false });
            this.props.history.push("/auth/login");
          });
      }
    }
    componentDidMount() {
      gaTrackingCode && ReactGA.initialize(gaTrackingCode);
      gaTrackingCode && ReactGA.pageview(this.props.location.pathname);
      if (
        !disableAuth &&
        this.props.location.pathname.indexOf("/auth") === -1
      ) {
        rootStore.authDomainStore
          .isAuthenticated()
          .then(res => {
            if (res.status !== 200) {
              this.setState({ isLoggedIn: false });
            } else {
              this.setState({ isLoggedIn: true, currentUser: res.data });
            }
          })
          .catch(err => {
            this.setState({ isLoggedIn: false });
            this.props.history.push("/auth/login");
          });
      }
    }
    onLogout() {
      rootStore.authDomainStore.logout();
    }
    render() {
      const { isLoggedIn } = this.state;
      const { classes } = this.props;
      console.log("WITH ORBITAL CLASSES", classes);
      console.log("WITH ORBITAL THEME", theme);
      const currentRouteList = isLoggedIn ? routeList : routeListLoggedOut;
      return (
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route
                path="/auth/login"
                render={({ location, history, match }) => {
                  console.log("LOGIN PAGE");
                  return (
                    <LoginWrapper backgroundImage={loginBG}>
                      <LoginWithAuth
                        authUiStore={rootStore.authUiStore}
                        authDomainStore={rootStore.authDomainStore}
                      >
                        <Login
                          onRegister={() => history.push("/auth/register")}
                          onForgotPassword={() =>
                            history.push("/auth/forgot-password")
                          }
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
                path="/auth/register"
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper backgroundImage={registerBG}>
                      <RegisterWithAuth
                        authDomainStore={rootStore.authDomainStore}
                        authUiStore={rootStore.authUiStore}
                      >
                        <Register
                          onLogin={() => history.push("/auth/login")}
                          location={location}
                          history={history}
                          match={match}
                        />
                      </RegisterWithAuth>
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path="/auth/forgot-password"
                render={({ location, history, match }) => {
                  return (
                    <LoginWrapper backgroundImage={registerBG}>
                      <Auth authDomainStore={rootStore.authDomainStore}>
                        <ForgotPassword
                          onLogin={() => history.push("/auth/login")}
                          location={location}
                          history={history}
                          match={match}
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
                    <LoginWrapper backgroundImage={registerBG}>
                      <Auth authDomainStore={rootStore.authDomainStore}>
                        <ResetPassword
                          onLogin={() => history.push("/auth/login")}
                          location={location}
                          history={history}
                          match={match}
                        />
                      </Auth>
                    </LoginWrapper>
                  );
                }}
              />
              <Route
                path="/profile"
                render={({ location, match, history }) => {
                  return (
                    <MainWrapper
                      classes={classes}
                      routeList={currentRouteList}
                      location={location}
                      match={match}
                      history={history}
                      auth={this.state.isLoggedIn}
                      user={this.state.currentUser}
                      logo={logo}
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
                path="/notifications"
                render={({ location, match, history }) => {
                  return (
                    <MainWrapper
                      classes={classes}
                      routeList={currentRouteList}
                      location={location}
                      match={match}
                      history={history}
                      auth={this.state.isLoggedIn}
                      user={this.state.currentUser}
                      logo={logo}
                      hasPadding={true}
                      onLogout={this.onLogout}
                    >
                      <Crud
                        modelName="notifications"
                        SERVER={config.SERVER}
                        offlineStorage={offlineStorage}
                        notificationDomainStore={
                          rootStore.notificationDomainStore
                        }
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
                              <NotificationPage
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
              <WrappedComponent
                user={this.state.currentUser}
                isLoggedIn={isLoggedIn}
                appSettings={this.state.appSettings}
                onLogout={this.onLogout}
                classes={classes}
                location={this.props.location}
                match={this.props.match}
                history={this.props.history}
              />
              <Route
                path="*"
                render={({ location, match, history }) => {
                  return (
                    <MainWrapper
                      classes={classes}
                      routeList={currentRouteList}
                      location={location}
                      match={match}
                      history={history}
                      auth={this.state.isLoggedIn}
                      user={this.state.currentUser}
                      logo={logo}
                      hasPadding={true}
                      onLogout={this.onLogout}
                    >
                      <NotFound />
                    </MainWrapper>
                  );
                }}
              />
            </Switch>
          </Router>
        </ThemeProvider>
      );
    }
  }
  return compose(withStyles(styles, { defaultTheme: theme }))(WithOrbital);
};

export default withOrbitalMobile;
