import { observer } from "mobx-react";
import { observable } from "mobx";
import React from "react";
import axios from "axios";

//export store
export class authDomainStore {
  token;
  @observable
  user;
  isLoggedIn = false;
  offlineStorage;
  rootStore;
  SERVER;
  constructor(rootStore, offlineStorage, SERVER) {
    //set the local storage mechanism
    //could be async storage
    this.rootStore = rootStore;
    if (offlineStorage) {
      this.offlineStorage = offlineStorage;
    }
    this.SERVER = SERVER;
  }
  logout() {
    return this.clearToken();
  }
  forgotPassword({ email }) {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${this.SERVER.host}:${this.SERVER.port}/auth/forgot-password`, {
          email
        })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          return reject(err && err.response && err.response.data);
        });
    });
  }
  changePassword({ token, newPassword, email }) {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${this.SERVER.host}:${this.SERVER.port}/auth/change-password`, {
          email,
          token,
          newPassword
        })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          return reject(err.response.data);
        });
    });
  }
  resendConfirmationEmail({ email }) {
    return new Promise((resolve, reject) => {
      return axios
        .post(
          `${this.SERVER.host}:${this.SERVER.port}/auth/resend-email-confirmation`,
          {
            email
          }
        )
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          return reject(err && err.response && err.response.data);
        });
    });
  }
  login(values) {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${this.SERVER.host}:${this.SERVER.port}/auth`, values)
        .then(res => {
          this.user = res.data;
          this.isLoggedIn = true;
          this.storeToken(this.user.jwtToken, "jwtToken");
          return resolve(res.data);
        })
        .catch(err => {
          return reject(err && err.response && err.response.data);
        });
    });
  }
  register(values) {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${this.SERVER.host}:${this.SERVER.port}/auth/register`, values)
        .then(res => {
          this.user = res.data;
          this.isLoggedIn = true;
          this.storeToken(this.user.jwtToken);
          return resolve(res.data);
        })
        .catch(err => {
          this.isLoggedIn = false;
          return reject(err && err.response && err.response.data);
        });
    });
  }
  loginWithProvider(providerName) {
    window.location.replace(
      `${this.SERVER.host}:${this.SERVER.port}/${providerName}/auth`
    );
  }
  registerWithProvider(providerName) {
    //information to register
    window.location.replace(
      `${this.SERVER.host}:${this.SERVER.port}/${providerName}/auth`
    );
  }
  storeToken(token, key) {
    if (token) {
      return this.offlineStorage.setItem(key, token);
    }
  }
  clearToken() {
    return this.offlineStorage.removeItem("jwtToken");
  }
  isAuthenticated() {
    return new Promise((resolve, reject) => {
      return this.offlineStorage.getItem("jwtToken").then(token => {
        return axios
          .post(`${this.SERVER.host}:${this.SERVER.port}/jwt`, {
            token
          })
          .then(msg => {
            return resolve(msg);
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }
}

export class authUiStore {
  @observable
  username;
  @observable
  password;
  @observable
  email;
  @observable
  firstname;
  @observable
  lastname;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
}

//somehow we have to load stuff from an api
export const api = {
  googleAuth: "",
  facebookAuth: "",
  twitterAuth: ""
};

//determine the theme here and load the right login information?
export const LoginWithAuth = observer(
  ({ children, authUiStore, authDomainStore, ...rest }) => {
    let decoratedLogin = React.Children.map(children, child =>
      React.cloneElement(child, {
        onChange: (field, value) => {
          authUiStore[field] = value;
        },
        onSubmit: values => {
          return authDomainStore.login(values);
        },
        onProviderAuth: providerName => {
          authDomainStore.loginWithProvider(providerName);
        },
        ...rest,
        ...child.props
      })
    );
    return <React.Fragment>{decoratedLogin}</React.Fragment>;
  }
);

export const RegisterWithAuth = observer(
  ({ children, authUiStore, authDomainStore }) => {
    let decoratedRegister = React.Children.map(children, child =>
      React.cloneElement(children, {
        onChange: (field, value) => {
          authUiStore[field] = value;
        },
        onSubmit: values => {
          return authDomainStore.register(values);
        },
        onProviderAuth: providerName => {
          authDomainStore.loginWithProvider(providerName);
        },
        ...child.props
      })
    );
    return <React.Fragment>{decoratedRegister}</React.Fragment>;
  }
);

const injectProps = (authDomainStore, props, child) => {
  let injected = {
    login: values => authDomainStore.login(values),
    register: values => authDomainStore.register(values),
    forgotPassword: email => authDomainStore.forgotPassword(email),
    changePassword: ({ newPassword, email, token }) =>
      authDomainStore.changePassword({ newPassword, email, token }),
    loginWithProvider: providerName =>
      authDomainStore.loginWithProvider(providerName),
    registerWithProvider: providerName =>
      authDomainStore.registerWithProvider(registerWithProvider),
    resendConfirmationEmail: email =>
      authDomainStore.resendConfirmationEmail(email),
    ...props,
    ...child.props
  };
  return injected;
};

//determine the theme here and load the right login information?
@observer
export class Auth extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let { authDomainStore } = this.props;
    authDomainStore.isAuthenticated();
  }
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let { children, authDomainStore } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(authDomainStore, this.props, child);
      return React.cloneElement(child, injectedProps);
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

export function withAuth(WrappedComponent) {
  @observer
  class WithAuth extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      let { authDomainStore } = this.props;
      authDomainStore.isAuthenticated();
    }
    componentWillReceiveProps() {}
    render() {
      let { authDomainStore } = this.props;
      let injectedProps = injectProps(authDomainStore, this.props, this);
      return <WrappedComponent {...injectedProps} />;
    }
  }
  return WithAuth;
}
