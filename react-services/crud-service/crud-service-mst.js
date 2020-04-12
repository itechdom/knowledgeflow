import { observer } from "mobx-react";
import { types } from "mobx-state-tree";
import React from "react";
import axios from "axios";

const Filter = types.model("Filter", {
  name: types.string,
  value: types.string,
});

//export store
export const getCrudDomainStore = (
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
      paginate: types.optional(types.boolean, false),
      page: types.optional(types.number, 1),
      filters: types.array(Filter),
    })
    .actions((self) => ({
      setPage(page) {
        self.page = page;
      },
      setPaginate(paginate) {
        self.paginate = paginate;
      },
      fetchModel(query) {
        self.loading = true;
        return offlineStorage
          .getItem("jwtToken")
          .then((token) => {
            let url;
            if (query) {
              url = `${SERVER.host}:${SERVER.port}/${modelName}`;
            } else if (self.paginate) {
              url = `${SERVER.host}:${SERVER.port}/${modelName}/paginate/${self.page}/10`;
            } else {
              url = `${SERVER.host}:${SERVER.port}/${modelName}`;
            }
            return axios
              .get(url, { params: { token, query } })
              .then((res) => {
                transform
                  ? self.setSuccess(transform(res.data))
                  : self.setSuccess(res.data);
              })
              .catch((err) => {
                self.setError(err);
              });
          })
          .catch((err) => {
            return self.setError(err);
          });
      },
      createModel(model) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then((token) => {
          return axios
            .post(`${SERVER.host}:${SERVER.port}/${modelName}/create`, {
              model,
              token,
            })
            .then((res) => {
              self.setSuccess(
                [...self.state, model],
                `${modelName} successfully created!`
              );
              return res.data;
            })
            .catch((err) => {
              return self.setError(err);
            });
        });
      },
      updateModel(model, updateValues) {
        self.loading = true;
        Object.keys(updateValues).map((key) => {
          model[key] = updateValues[key];
        });
        return offlineStorage.getItem("jwtToken").then((token) => {
          return axios
            .put(`${SERVER.host}:${SERVER.port}/${modelName}`, {
              model,
              token,
            })
            .then((res) => {
              self.setSuccess(
                [...self.state.filter((m) => model._id !== m._id), model],
                `${modelName} successfully updated!`
              );
            })
            .catch((err) => {
              return self.setError(err);
            });
        });
      },
      deleteModel(model) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then((token) => {
          return axios
            .delete(`${SERVER.host}:${SERVER.port}/${modelName}/${model._id}`, {
              params: { token },
            })
            .then((res) => {
              self.setSuccess(
                self.state.filter((m) => m !== model),
                `${modelName} successfully deleted!`
              );
            })
            .catch((err) => {
              return self.setError(err);
            });
        });
      },
      searchModel(query) {
        // self.loading = true;
        return offlineStorage.getItem("jwtToken").then((token) => {
          return axios
            .post(`${SERVER.host}:${SERVER.port}/${modelName}/search`, {
              query,
              token,
            })
            .then((res) => {
              //new data
              let formattedData = {
                data: res.data.data,
                count: res.data.count,
              };
              return formattedData;
            })
            .catch((err) => {
              console.log("err", err);
              return self.setError(err);
            });
        });
      },
      searchModels(query, modelName) {
        self.loading = true;
        return offlineStorage.getItem("jwtToken").then((token) => {
          return axios
            .post(`${SERVER.host}:${SERVER.port}/${modelName}/search`, {
              query,
              token,
            })
            .then((res) => {
              return res.data;
            })
            .catch((err) => {
              console.log("err", err);
              return self.setError(err);
            });
        });
      },
      setFilter(filter) {
        //add if not already defined
        const foundFilter = self.filters.find((f) => f.name === filter.name);
        if (!foundFilter) {
          self.filters.push(filter);
        }
      },
      removeFilter(filter) {
        self.filters = self.filters.filter((f) => f.name !== filter.name);
      },
      setError(err) {
        self.loading = false;
        if (notificationDomainStore) {
          notificationDomainStore.saveNotification(modelName, {
            message: !err.response
              ? err
              : err && err.response && err.response.data.message,
            type: "error",
          });
        }
        self.status = "error";
      },
      setSuccess(data, successMessage) {
        self.loading = false;
        if (notificationDomainStore && successMessage) {
          notificationDomainStore.saveNotification(modelName, {
            message: successMessage,
            type: "success",
          });
        }
        if (data) {
          self.state = data;
        }
        self.status = "success";
      },
    }))
    .views((self) => ({
      getModel() {
        return self.state;
      },
      isLoading() {
        return self.loading;
      },
      getPage() {
        return self.page;
      },
    }));

const injectProps = (
  crudDomainStore,
  modelName,
  props,
  child,
  transform,
  query
) => {
  let injected = {
    ...props,
    ...child.props,
  };
  injected[modelName] = transform
    ? transform(crudDomainStore.state)
    : crudDomainStore.state;
  injected[`${modelName}_fetchModel`] = (q) => {
    let Query = q ? q : query;
    crudDomainStore.fetchModel(Query);
  };
  injected[`${modelName}_getModel`] = () => {
    crudDomainStore.getModel(transform);
  };
  injected[`${modelName}_createModel`] = (model) =>
    crudDomainStore.createModel(model);

  injected[`${modelName}_updateModel`] = (model, updateValues) =>
    crudDomainStore.updateModel(model, updateValues);

  injected[`${modelName}_deleteModel`] = (model) =>
    crudDomainStore.deleteModel(model);

  injected[`${modelName}_searchModel`] = (q) => crudDomainStore.searchModel(q);

  injected[`${modelName}_setPage`] = (page) => crudDomainStore.setPage(page);

  injected[`${modelName}_page`] = crudDomainStore.getPage();

  injected[`searchModels`] = (query, modelNames) => {
    let promises = modelNames.map((mName) => {
      return crudDomainStore.searchModels(query, mName).then((res) => {
        return { res };
      });
    });
    return promises;
  };

  injected[`${modelName}_set_filter`] = (filter) =>
    crudDomainStore.setFilter(filter);

  injected[`${modelName}_remove_filter`] = (filter) =>
    crudDomainStore.removeFilter(filter);

  injected[`${modelName}_loading`] = crudDomainStore.isLoading();

  return injected;
};

//determine the theme here and load the right login information?
class CrudContainer extends React.Component {
  constructor(props) {
    super(props);
    this.stores = {};
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.paginate !== this.props.paginate ||
      nextProps.query !== this.props.query
    ) {
      const crudDomainStore = this.stores[this.props.modelName];
      crudDomainStore.setPaginate(nextProps.paginate);
      crudDomainStore.fetchModel(nextProps.query);
    }
  }
  componentDidUpdate() {}
  render() {
    let {
      modelName,
      children,
      skipLoadOnInit,
      transform,
      offlineStorage,
      SERVER,
      notificationDomainStore,
      query,
      paginate,
      render,
    } = this.props;
    if (modelName && !this.stores[modelName] && !skipLoadOnInit) {
      const crudDomainStore = getCrudDomainStore(
        modelName,
        offlineStorage,
        SERVER,
        notificationDomainStore,
        transform
      ).create({
        state: [],
        id: "1",
        status: "initial",
      });
      crudDomainStore.setPaginate(paginate || false);
      crudDomainStore.fetchModel(query);
      this.stores[modelName] = crudDomainStore;
    }
    console.log("rerender crud service");
    const childrenWithProps = render
      ? render(
          injectProps(
            this.stores[modelName],
            modelName,
            this.props,
            {},
            null,
            query
          )
        )
      : React.Children.map(children, (child) => {
          let injectedProps = injectProps(
            this.stores[modelName],
            modelName,
            this.props,
            child,
            transform,
            query
          );
          return React.cloneElement(child, { ...injectedProps });
        });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

export function withCrud(WrappedComponent) {
  class WithCrud extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      let { crudDomainStore, transform, query } = this.props;
      crudDomainStore.getModel(query, transform);
    }
    componentWillReceiveProps() {}
    render() {
      let { crudDomainStore, transform } = this.props;
      let injectedProps = injectProps(
        crudDomainStore,
        this.props,
        this,
        transform
      );
      return <WrappedComponent {...injectedProps} />;
    }
  }
  return observer(WithCrud);
}

export const Crud = observer(CrudContainer);
