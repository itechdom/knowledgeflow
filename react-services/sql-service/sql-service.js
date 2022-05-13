import { observer } from "mobx-react";
import { types } from "mobx-state-tree";
import React from "react";
import axios from "axios";

const Filter = types.model("Filter", {
  name: types.string,
  value: types.string
});

//export store
export const getSqlDomainStore = (
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
      executeSql(sql) {
        self.loading = true;
        return offlineStorage
          .getItem("jwtToken")
          .then(token => {
            return axios
              .post(`${SERVER.host}:${SERVER.port}/${modelName}/sql`, {
                token,
                sql
              })
              .then(res => {
                return transform
                  ? self.setSuccess(transform(res.data))
                  : self.setSuccess(res.data, "Query successfully run");
              })
              .catch(err => {
                return self.setError(err);
              });
          })
          .catch(err => {
            return self.setError(err);
          });
      },
      executeBulkSql(sqlStatements) {
        self.loading = true;
        return offlineStorage
          .getItem("jwtToken")
          .then(token => {
            return axios
              .post(`${SERVER.host}:${SERVER.port}/${modelName}/sql/bulk`, {
                token,
                sqlStatements
              })
              .then(res => {
                return transform
                  ? self.setSuccess(transform(res.data))
                  : self.setSuccess(res.data, "Query successfully run");
              })
              .catch(err => {
                return self.setError(err);
              });
          })
          .catch(err => {
            return self.setError(err);
          });
      },
      setError(err) {
        self.loading = false;
        console.log("err", err);
        const error = {
          message: !err.response
            ? err
            : err &&
              err.response &&
              `${err.response.data.message}, in Query number ${err.response.data
                .lineNumber - 1}, Check the logs for more info`,
          type: "error"
        };
        if (notificationDomainStore) {
          notificationDomainStore.saveNotification(modelName, error);
          self.state = err.response.data;
        }
        self.status = "error";
        return err;
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
        return data;
      }
    }))
    .views(self => ({
      getModel() {
        return self.state;
      },
      isLoading() {
        return self.loading;
      }
    }));

const injectProps = (sqlDomainStore, modelName, props, child, transform) => {
  let injected = {
    ...props,
    ...child.props
  };
  injected[`${modelName}_sqlResult`] = transform
    ? transform(sqlDomainStore.state)
    : sqlDomainStore.state;
  injected[`${modelName}_executeSql`] = sql => {
    sqlDomainStore.executeSql(sql);
  };
  injected[`${modelName}_executeBulkSql`] = sql => {
    sqlDomainStore.executeBulkSql(sql);
  };
  return injected;
};

//determine the theme here and load the right login information?
class SqlContainer extends React.Component {
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
    if (modelName && !this.stores[modelName]) {
      const sqlDomainStore = getSqlDomainStore(
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
      this.stores[modelName] = sqlDomainStore;
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

export function withSql(WrappedComponent) {
  class WithSql extends React.Component {
    constructor(props) {
      super(props);
    }
    componentWillReceiveProps() {}
    render() {
      let { sqlDomainStore, transform } = this.props;
      let injectedProps = injectProps(
        sqlDomainStore,
        this.props,
        this,
        transform
      );
      return <WrappedComponent {...injectedProps} />;
    }
  }
  return observer(WithSql);
}

export const Sql = observer(SqlContainer);
