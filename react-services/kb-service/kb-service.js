import { observer } from "mobx-react";
import { observable, action, runInAction, toJS } from "mobx";
import React from "react";
import axios from "axios";

//export store
export class kbDomainStore {
  modelName;
  rootStore;
  SERVER;
  offlineStorage;
  notificationDomainStore;
  constructor(rootStore, offlineStorage, SERVER, notificationDomainStore) {
    this.rootStore = rootStore;
    this.notificationDomainStore = notificationDomainStore;
    if (offlineStorage) {
      this.offlineStorage = offlineStorage;
    }
    this.SERVER = SERVER;
  }
  @action
  createKnowledge(modelName, model) {}
  @action
  updateKnowledge(modelName, model, updateValues) {}
  @action
  deleteKnowledge(modelName, model) {}
  @action
  searchKnowledge(modelName, model, query) {
    let results = [];
    function recur(modelName, model, query) {
      model &&
        Object.keys(model).map(k => {
          const res = model[k].title
            .toLowerCase()
            .match(new RegExp(query.toLowerCase()));
          res && results.push(model[k]);
          return recur(modelName, model[k].ideas, query);
        });
    }
    recur(modelName, model, query);
    return results;
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
  @action
  getAppSettings() {
    return this.offlineStorage.getItem("jwtToken").then(token => {
      return axios
        .get(`${this.SERVER.host}:${this.SERVER.port}/settings`, {
          params: { token }
        })
        .then(res => {
          runInAction(() => {
            this.mapStore.set("settings", res.data);
          });
          return res.data[0];
        })
        .catch(err => {
          this.setError("settings", err);
        });
    });
  }
}

const injectProps = (kbDomainStore, modelName, props, child, query) => {
  let injected = {
    createKnowledge: model => kbDomainStore.createKnowledge(modelName, model),
    updateKnowledge: (model, updateValues) =>
      kbDomainStore.updateKnowledge(modelName, model, updateValues),
    deleteKnowledge: model => kbDomainStore.deleteKnowledge(modelName, model),
    query: query,
    ...props,
    ...child.props
  };

  injected[`${modelName}_createKnowledge`] = model =>
    kbDomainStore.createKnowledge(modelName, model);

  injected[`${modelName}_updateKnowledge`] = (model, updateValues) =>
    kbDomainStore.updateKnowledge(modelName, model, updateValues);

  injected[`${modelName}_deleteKnowledge`] = model =>
    kbDomainStore.deleteKnowledge(modelName, model);

  injected[`${modelName}_searchKnowledge`] = (model, query, onRes) =>
    kbDomainStore.searchKnowledge(modelName, model, query, onRes);

  return injected;
};

//determine the theme here and load the right login information?
@observer
export class Kb extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let { modelName, children, kbDomainStore, query } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(
        kbDomainStore,
        modelName,
        this.props,
        child,
        query
      );
      return React.cloneElement(child, injectedProps);
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}
