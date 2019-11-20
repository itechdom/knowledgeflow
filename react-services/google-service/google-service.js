import { observer } from "mobx-react";
import { observable, action, runInAction, toJS } from "mobx";
import React from "react";
import axios from "axios";

//export store
export class crudDomainStore {
  modelName;
  isEditing = observable.map();
  mapStore = observable.map();
  searchResults = observable.map();
  editedModel = observable.map();
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
  forceUpdate(modelName) {
    let current = this.mapStore.get(modelName);
    this.mapStore.set(modelName, []);
    this.mapStore.set(modelName, current);
  }
  @action
  getModel(query, modelName, refresh) {
    //cached data, you don't have to hit up he end point
    if (this.mapStore.get(modelName) && !refresh) {
      return;
    }
    return this.offlineStorage.getItem("jwtToken").then(token => {
      return axios
        .get(`${this.SERVER.host}:${this.SERVER.port}/${modelName}`, {
          params: { token, query }
        })
        .then(res => {
          runInAction(() => {
            this.mapStore.set(modelName, res.data);
          });
        })
        .catch(err => {
          this.setError(modelName, err);
        });
    });
  }
  @action
  createModel(modelName, model) {
    return this.offlineStorage.getItem("jwtToken").then(token => {
      return axios
        .post(`${this.SERVER.host}:${this.SERVER.port}/${modelName}/create`, {
          model,
          token
        })
        .then(res => {
          let current = this.mapStore.get(modelName);
          this.mapStore.set(modelName, [...current, res.data]);
          this.mapStore.set(modelName, updatedModel);
          this.setSuccess(modelName, `${modelName} successfully created!`);
          return res.data;
        })
        .catch(err => {
          return this.setError(modelName, err);
        });
    });
  }
  @action
  updateModel(modelName, model, updateValues) {
    let extractedModel = toJS(model);
    Object.keys(updateValues).map(key => {
      model[key] = updateValues[key];
    });
    return this.offlineStorage.getItem("jwtToken").then(token => {
      return axios
        .put(`${this.SERVER.host}:${this.SERVER.port}/${modelName}`, {
          model,
          token
        })
        .then(res => {
          let updatedModel = this.mapStore
            .get(modelName)
            .map(cModel => (cModel._id === model._id ? model : cModel));
          this.mapStore.set(modelName, updatedModel);
          this.setSuccess(modelName, `${modelName} successfully updated!`);
          return res.data;
        })
        .catch(err => {
          return this.setError(modelName, err);
        });
    });
  }
  @action
  deleteModel(modelName, model) {
    model.deleted = true;
    return this.offlineStorage.getItem("jwtToken").then(token => {
      return axios
        .delete(
          `${this.SERVER.host}:${this.SERVER.port}/${modelName}/${model._id}`,
          {
            params: { token }
          }
        )
        .then(res => {
          this.setSuccess(modelName, `${modelName} successfully deleted!`);
          return res.data;
        })
        .catch(err => {
          return this.setError(modelName, err);
        });
    });
  }
  @action
  searchModel(modelName, query) {
    return axios
      .post(`${this.SERVER.host}:${this.SERVER.port}/${modelName}`, query)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        return this.setError(modelName, err);
      });
  }
  @action
  setModelEdit(modelName, model, isEdit) {
    let { editedModel, isEditing } = this.rootStore.crudDomainStore;
    editedModel.set(modelName, model);
    isEditing.set(modelName, isEdit);
  }
  @action
  setIsEditing(modelName, isEdit) {
    let { editedModel, isEditing } = this.rootStore.crudDomainStore;
    isEditing.set(modelName, isEdit);
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

const injectProps = (crudDomainStore, modelName, props, child, query) => {
  let injected = {
    model: crudDomainStore.mapStore.get(modelName),
    getModel: query => crudDomainStore.getModel(query, modelName, true),
    createModel: model => crudDomainStore.createModel(modelName, model),
    updateModel: (model, updateValues) =>
      crudDomainStore.updateModel(modelName, model, updateValues),
    deleteModel: model => crudDomainStore.deleteModel(modelName, model),
    setModelEdit: (model, isEditing) =>
      crudDomainStore.setModelEdit(modelName, model, isEditing),
    isEditing: crudDomainStore.isEditing.get(modelName),
    setIsEditing: isEdit => crudDomainStore.setIsEditing(modelName, isEdit),
    editedModel: crudDomainStore.editedModel.get(modelName),
    query: query,
    ...props,
    ...child.props
  };
  injected[modelName] = crudDomainStore.mapStore.get(modelName);

  injected[`${modelName}_getModel`] = query =>
    crudDomainStore.getModel(query, modelName, true);

  injected[`${modelName}_createModel`] = model =>
    crudDomainStore.createModel(modelName, model);

  injected[`${modelName}_updateModel`] = (model, updateValues) =>
    crudDomainStore.updateModel(modelName, model, updateValues);

  injected[`${modelName}_deleteModel`] = model =>
    crudDomainStore.deleteModel(modelName, model);

  injected[`${modelName}_setModelEdit`] = (model, isEditing) =>
    crudDomainStore.setModelEdit(modelName, model, isEditing);

  injected[`${modelName}_isEditing`] = crudDomainStore.isEditing.get(modelName);

  injected[`${modelName}_setIsEditing`] = isEdit =>
    crudDomainStore.setIsEditing(modelName, isEdit);

  injected[`${modelName}_query`] = query;

  return injected;
};

//determine the theme here and load the right login information?
@observer
export class Crud extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let {
      modelName,
      children,
      crudDomainStore,
      skipLoadOnInit,
      query
    } = this.props;
    if (modelName && !skipLoadOnInit) {
      crudDomainStore.getModel(query, modelName, false);
    }
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(
        crudDomainStore,
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

export function withCrud(WrappedComponent) {
  @observer
  class WithCrud extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      let { modelName, crudDomainStore, query } = this.props;
      crudDomainStore.getModel(query, modelName, false);
    }
    componentWillReceiveProps() {}
    render() {
      let { modelName, crudDomainStore, query } = this.props;
      let injectedProps = injectProps(
        crudDomainStore,
        modelName,
        this.props,
        this,
        query
      );
      return <WrappedComponent {...injectedProps} />;
    }
  }
  return WithCrud;
}
