import { observer } from "mobx-react";
import { observable, action, runInAction, toJS } from "mobx";
import axios from "axios";
import React from "react";
//export store
export class unsplashDomainStore {
  modelName;
  rootStore;
  SERVER;
  offlineStorage;
  mapStore;
  notificationDomainStore;
  constructor(
    rootStore,
    offlineStorage,
    SERVER,
    accessKey,
    notificationDomainStore
  ) {
    this.rootStore = rootStore;
    this.notificationDomainStore = notificationDomainStore;
    if (offlineStorage) {
      this.offlineStorage = offlineStorage;
    }
    this.SERVER = SERVER;
    this.accessKey = accessKey;
    this.mapStore = { brand: 0 };
  }
  @action
  getUnsplash(query, modelName, refresh) {
    if (this.mapStore[query] && !refresh) {
      return new Promise((resolve, reject) => {
        return resolve(this.mapStore[query]);
      });
    }
    return axios
      .get(
        `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${
          this.accessKey
        }`
      )
      .then(res => {
        this.mapStore[query] = res.data.results.map(res => res.urls);
        return res.data.results.map(res => res.urls);
      })
      .catch(err => {
        console.log("ERR", err);
        this.setError(modelName, err);
      });
  }
  @action
  setError(modelName, err) {
    if (this.notificationDomainStore) {
      this.notificationDomainStore.saveNotification(modelName, {
        message: err && err.response && err.response.data.message,
        type: "error"
      });
    }
  }
  @action
  setSuccess(modelName, successMessage) {
    if (this.notificationDomainStore) {
      this.notificationDomainStore.saveNotification(modelName, {
        message: successMessage,
        type: "success"
      });
    }
  }
}

const injectProps = (unsplashDomainStore, modelName, props, child) => {
  let injected = {
    getUnsplash: query => unsplashDomainStore.getUnsplash(query, modelName),
    ...props,
    ...child.props
  };
  injected[`${modelName}_getUnsplash`] = query => {
    unsplashDomainStore.getUnsplash(query, modelName);
  };
  return injected;
};

//determine the theme here and load the right login information?
@observer
export class Unsplash extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let { modelName, children, unsplashDomainStore } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(
        unsplashDomainStore,
        modelName,
        this.props,
        child
      );
      return React.cloneElement(child, injectedProps);
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}
export function withUnsplash(WrappedComponent) {
  @observer
  class WithUnsplash extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      let { modelName, unsplashDomainStore } = this.props;
      let injectedProps = injectProps(
        unsplashDomainStore,
        modelName,
        this.props,
        this
      );
      return <WrappedComponent {...injectedProps} />;
    }
  }
  return WithUnsplash;
}
