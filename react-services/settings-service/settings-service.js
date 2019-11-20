import { observer } from "mobx-react";
import { types } from "mobx-state-tree";
import React from "react";
import axios from "axios";

const Filter = types.model("Filter", {
  name: types.string,
  value: types.string
});

//export store
export const getSettingsDomainStore = (
  modelName,
  offlineStorage,
  SERVER,
  notificationDomainStore,
  transform
) =>
  types
    .model({
      id: types.identifier,
      state: types.frozen(),
      status: types.string,
      loading: types.optional(types.boolean, true),
      filters: types.array(Filter)
    })
    .actions(self => ({
      fetchSettings() {
        self.loading = true;
        return offlineStorage
          .getItem("jwtToken")
          .then(token => {
            return axios
              .get(`${SERVER.host}:${SERVER.port}/${modelName}/settings`, {
                params: { token }
              })
              .then(res => {
                transform
                  ? self.setSuccess(transform(res.data))
                  : self.setSuccess(res.data);
              })
              .catch(err => {
                self.setError(err);
              });
          })
          .catch(err => {
            return self.setError(err);
          });
      },
      updateSettings(model, updateValues) {
        self.loading = true;
        Object.keys(updateValues).map(key => {
          model[key] = updateValues[key];
        });
        return offlineStorage.getItem("jwtToken").then(token => {
          return axios
            .put(`${SERVER.host}:${SERVER.port}/${modelName}/settings`, {
              model,
              token
            })
            .then(res => {
              self.setSuccess(
                [...self.state.filter(m => model._id !== m._id), model],
                `${modelName} successfully updated!`
              );
            })
            .catch(err => {
              return self.setError(err);
            });
        });
      },
      searchSettings(query) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then(token => {
          return axios
            .post(
              `${SERVER.host}:${SERVER.port}/${modelName}/settings/search`,
              {
                query,
                token
              }
            )
            .then(res => {
              return res.data;
            })
            .catch(err => {
              console.log("err", err);
              return self.setError(err);
            });
        });
      },
      searchSettingss(query, modelName) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then(token => {
          return axios
            .post(
              `${SERVER.host}:${SERVER.port}/${modelName}/settings/search`,
              {
                query,
                token
              }
            )
            .then(res => {
              return res.data;
            })
            .catch(err => {
              console.log("err", err);
              return self.setError(err);
            });
        });
      },
      setFilter(filter) {
        //add if not already defined
        const foundFilter = self.filters.find(f => f.name === filter.name);
        if (!foundFilter) {
          self.filters.push(filter);
        }
      },
      removeFilter(filter) {
        self.filters = self.filters.filter(f => f.name !== filter.name);
      },
      setError(err) {
        self.loading = false;
        if (notificationDomainStore) {
          notificationDomainStore.saveNotification(modelName, {
            message: !err.response
              ? err
              : err && err.response && err.response.data.message,
            type: "error"
          });
        }
        self.status = "error";
      },
      setSuccess(data, successMessage) {
        self.loading = false;
        if (notificationDomainStore && successMessage) {
          notificationDomainStore.saveNotification(modelName, {
            message: successMessage,
            type: "success"
          });
        }
        if (data) {
          self.state = data;
        }
        self.status = "success";
      }
    }))
    .views(self => ({
      getSettings() {
        return self.state;
      },
      isLoading() {
        return self.loading;
      }
    }));

const injectProps = (
  settingsDomainStore,
  modelName,
  props,
  child,
  transform
) => {
  let injected = {
    ...props,
    ...child.props
  };
  injected[`${modelName}_settings`] = transform
    ? transform(settingsDomainStore.state)
    : settingsDomainStore.state;
  injected[`${modelName}_getSettings`] = () => {
    settingsDomainStore.getSettings(transform);
  };

  injected[`${modelName}_updateSettings`] = (model, updateValues) =>
    settingsDomainStore.updateSettings(model, updateValues);

  injected[`${modelName}_searchSettings`] = query =>
    settingsDomainStore.searchSettings(query);

  injected[`searchSettingss`] = (query, modelNames) => {
    let promises = modelNames.map(mName => {
      return settingsDomainStore.searchSettingss(query, mName).then(res => {
        return { res };
      });
    });
    return promises;
  };

  injected[`${modelName}_set_filter`] = filter =>
    settingsDomainStore.setFilter(filter);

  injected[`${modelName}_remove_filter`] = filter =>
    settingsDomainStore.removeFilter(filter);

  injected[`${modelName}_loading`] = settingsDomainStore.isLoading();

  return injected;
};

//determine the theme here and load the right login information?
class SettingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.stores = {};
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let {
      modelName,
      children,
      skipLoadOnInit,
      transform,
      offlineStorage,
      SERVER,
      notificationDomainStore
    } = this.props;
    if (modelName && !this.stores[modelName] && !skipLoadOnInit) {
      const settingsDomainStore = getSettingsDomainStore(
        modelName,
        offlineStorage,
        SERVER,
        notificationDomainStore,
        transform
      ).create({
        state: [],
        id: "1",
        status: "initial"
      });
      settingsDomainStore.fetchSettings();
      this.stores[modelName] = settingsDomainStore;
    }
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(
        this.stores[modelName],
        modelName,
        this.props,
        child,
        transform
      );
      return React.cloneElement(child, { ...injectedProps });
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

export function withSettings(WrappedComponent) {
  class WithSettings extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      let { settingsDomainStore, transform } = this.props;
      settingsDomainStore.getSettings(transform);
    }
    componentWillReceiveProps() {}
    render() {
      let { settingsDomainStore, transform } = this.props;
      let injectedProps = injectProps(
        settingsDomainStore,
        this.props,
        this,
        transform
      );
      return <WrappedComponent {...injectedProps} />;
    }
  }
  return observer(WithSettings);
}

export const Settings = observer(SettingsContainer);
