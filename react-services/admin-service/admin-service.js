import { observer } from "mobx-react";
import { observable, action, runInAction, toJS } from "mobx";
import React from "react";
import axios from "axios";

//export store
export class adminDomainStore {
  rootStore;
  SERVER;
  schemas = observable.map();
  constructor(rootStore, SERVER) {
    this.rootStore = rootStore;
    this.SERVER = SERVER;
  }
  @action
  getSchemas(refresh) {
    //cached data, you don't have to hit up he end point
    // console.log(this.schemas.length);
    if (this.schemas.get("schemas") && !refresh) {
      return;
    }
    return axios
      .get(`${this.SERVER.host}:${this.SERVER.port}/schemas`)
      .then(res => {
        runInAction(() => {
          let schemas = Object.keys(res.data).map(key => {
            let nameObject = {
              modelName: key
            };
            let schemas = {
              ...nameObject,
              ...res.data[key]
            };
            return schemas;
          });
          this.schemas.set("schemas", schemas);
        });
      })
      .catch(err => {
        runInAction(() => {});
      });
  }
  @action
  setError(err) {
    console.error(err);
  }
}

const injectProps = (adminDomainStore, props, child) => {
  let injected = {
    schemas: adminDomainStore.schemas.get("schemas"),
    ...props,
    ...child.props
  };
  return injected;
};

//this creates admin components with Modal Editing
@observer
export class Admin extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let { children, adminDomainStore } = this.props;
    adminDomainStore.getSchemas(false);
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(adminDomainStore, this.props, child);
      return React.cloneElement(child, injectedProps);
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

export function withAdmin(WrappedComponent) {
  @observer
  class WithAdmin extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      let { adminDomainStore } = this.props;
      adminDomainStore.getSchemas(false);
    }
    componentWillReceiveProps() {}
    render() {
      let { adminDomainStore } = this.props;
      let injectedProps = injectProps(adminDomainStore, this.props, this);
      return <WrappedComponent {...injectedProps} />;
    }
  }
  return WithAdmin;
}
