import React from "react";
import { observer } from "mobx-react";
import { types } from "mobx-state-tree";

const Filter = types.model("Filter", {
  name: types.string,
  value: types.string,
});

export const generateDomainStore = ({ myActionGenerator, modelName }) => {
  const getActions = ({
    self,
    notificationDomainStore,
    transform,
    offlineStorage,
    SERVER,
  }) => {
    const myActions = myActionGenerator({
      self,
      notificationDomainStore,
      transform,
      offlineStorage,
      SERVER,
    });
    return {
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
        return err;
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
        return self.state;
      },
      ...myActions,
    };
  };
  const getDomainStore = ({
    notificationDomainStore,
    myActionGenerator,
    offlineStorage,
    SERVER,
    transform,
  }) => {
    const getmyViews = (self) => {
      const myViews = {
        getState() {
          return self.state;
        },
        isLoading() {
          return self.loading;
        },
      };
      myViews[`${modelName}_getState`] = () => self.state;
      myViews[`${modelName}_isLoading`] = () => self.loading;
      return myViews;
    };
    return types
      .model({
        id: types.identifier,
        state: types.frozen(),
        status: types.string,
        loading: types.optional(types.boolean, true),
        filters: types.array(Filter),
      })
      .actions((self) =>
        getActions({
          myActionGenerator,
          self,
          notificationDomainStore,
          SERVER,
          transform,
          offlineStorage,
        })
      )
      .views((self) => getmyViews(self))
      .create({
        state: [],
        id: "1",
        status: "initial",
      });
  };
  return getDomainStore;
};

export const getServiceInjector = ({ modelName, domainStore, myActions }) => {
  const serviceInjector = ({ props, child, transform }) => {
    let injected = {
      ...props,
      ...child.props,
    };
    injected[modelName] = domainStore.getState();

    injected[`${modelName}_set_filter`] = (filter) =>
      domainStore.setFilter(filter);

    injected[`${modelName}_remove_filter`] = (filter) =>
      domainStore.removeFilter(filter);

    injected[`${modelName}_loading`] = domainStore.isLoading();

    Object.keys(myActions).map((key) => {
      injected[key] = domainStore[key];
    });

    return injected;
  };
  return serviceInjector;
};

export const getServiceHOC = ({
  modelName,
  domainStore,
  serviceInjector,
  children,
  transform,
}) => {
  class ServiceContainer extends React.Component {
    constructor(props) {
      super(props);
      this.stores = {};
    }
    componentDidMount() {}
    componentWillReceiveProps(nextProps) {}
    componentDidUpdate() {}
    render() {
      const childrenWithProps = React.Children.map(children, (child) => {
        let injectedProps = serviceInjector({
          domainStore,
          modelName,
          props: this.props,
          child,
          transform,
        });
        return React.cloneElement(child, { ...injectedProps });
      });
      return <React.Fragment>{childrenWithProps}</React.Fragment>;
    }
  }
  const ServiceWithObserver = observer(ServiceContainer);
  return ServiceWithObserver;
};
