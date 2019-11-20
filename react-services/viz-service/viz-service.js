import { observer } from "mobx-react";
import { types } from "mobx-state-tree";
import React from "react";
import axios from "axios";

//period has to be: Daily, Monthly, Yearly
const getUrl = (fn, SERVER, modelName, period, field) => {
  if (field) {
    return `${SERVER.host}:${SERVER.port}/${modelName}/${fn}/${field}`;
  }
  return `${SERVER.host}:${SERVER.port}/${modelName}/${fn}/${
    period ? "time/" : ""
  }${period ? `${period}/` : ""}`;
};

//export store
export const getVizDomainStore = (
  modelName,
  offlineStorage,
  SERVER,
  notificationDomainStore
) =>
  types
    .model({
      id: types.identifier,
      state: types.frozen(),
      status: types.string,
      loading: types.optional(types.boolean, true)
    })
    .actions(self => ({
      average(query, period, field) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then(token => {
          return axios
            .get(getUrl("average", SERVER, modelName, period), {
              params: {
                token,
                query
              }
            })
            .then(res => {
              self.setSuccess(`${modelName} successfully created!`);
              return res.data;
            })
            .catch(err => {
              return self.setError(err);
            });
        });
      },
      count(query, period, field) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then(token => {
          return axios
            .get(getUrl("count", SERVER, modelName, period, field), {
              params: {
                token,
                query
              }
            })
            .then(res => {
              self.setSuccess(`${modelName} successfully updated!`);
              return res.data && res.data.res ? res.data.res : res.data.count;
            })
            .catch(err => {
              return self.setError(err);
            });
        });
      },
      sum(query, period, field) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then(token => {
          return axios
            .get(getUrl("sum", SERVER, modelName, period), {
              params: {
                token,
                query
              }
            })
            .then(res => {
              self.setSuccess(`${modelName} successfully deleted!`);
            })
            .catch(err => {
              return self.setError(err);
            });
        });
      },
      aggregate(query, period, field) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then(token => {
          return axios
            .get(getUrl("distinct", SERVER, modelName, period), {
              params: {
                token,
                query
              }
            })
            .then(res => {
              return res.data;
            })
            .catch(err => {
              console.log("err", err);
              return self.setError(err);
            });
        });
      },
      aggregates(query, modelName) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then(token => {
          return axios
            .get(`${SERVER.host}:${SERVER.port}/${modelName}/search`, {
              query,
              token
            })
            .then(res => {
              return res.data;
            })
            .catch(err => {
              console.log("err", err);
              return self.setError(err);
            });
        });
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
      setSuccess(successMessage) {
        self.loading = false;
      }
    }))
    .views(self => ({
      isLoading() {
        return self.loading;
      }
    }));

const injectProps = (vizDomainStore, modelName, props, child, query) => {
  let injected = {
    ...props,
    ...child.props
  };

  injected[`${modelName}_sum`] = (query, period, field) => {
    vizDomainStore.sum(query, period, field);
  };
  injected[`${modelName}_average`] = (query, period, field) =>
    vizDomainStore.average(query, period, field);

  injected[`${modelName}_count`] = (query, period, field) =>
    vizDomainStore.count(query, period, field);

  injected[`${modelName}_distinct`] = (query, period, field) =>
    vizDomainStore.distinct(query, period, field);

  injected[`${modelName}_aggregate`] = query =>
    vizDomainStore.aggregate(query, period, field);

  injected[`aggregates`] = (query, modelNames) => {
    let promises = modelNames.map(mName => {
      return vizDomainStore.aggregates(query, mName).then(res => {
        return { res };
      });
    });
    return promises;
  };

  return injected;
};

//determine the theme here and load the right login information?
class VizContainer extends React.Component {
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
      query,
      transform,
      offlineStorage,
      SERVER,
      notificationDomainStore
    } = this.props;
    if (modelName && !this.stores[modelName] && !skipLoadOnInit) {
      const vizDomainStore = getVizDomainStore(
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
      this.stores[modelName] = vizDomainStore;
    }
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(
        this.stores[modelName],
        modelName,
        this.props,
        child,
        query,
        transform
      );
      return React.cloneElement(child, { ...injectedProps });
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

export function withViz(WrappedComponent) {
  class WithViz extends React.Component {
    constructor(props) {
      super(props);
    }
    componentWillReceiveProps() {}
    render() {
      let { vizDomainStore, query, transform } = this.props;
      let injectedProps = injectProps(
        vizDomainStore,
        this.props,
        this,
        query,
        transform
      );
      return <WrappedComponent {...injectedProps} />;
    }
  }
  return observer(WithViz);
}

export const Viz = observer(VizContainer);
