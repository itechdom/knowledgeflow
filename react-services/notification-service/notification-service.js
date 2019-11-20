import { observer } from "mobx-react";
import { observable, action } from "mobx";
import React from "react";
import io from "socket.io-client";

//export store
export class notificationDomainStore {
  modelName;
  mapStore = observable.map();
  rootStore;
  SERVER;
  offlineStorage;
  constructor(rootStore, offlineStorage, SERVER) {
    this.rootStore = rootStore;
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
  subscribe({
    onInit,
    onConnect,
    onEvent,
    onDisconnect,
    port,
    modelName,
    server
  }) {
    const domainName = `${server}:${port}/${modelName}`;
    let newSocket = io(domainName);
    newSocket.on("init", data => {
      onInit(data);
    });
    newSocket.on("connect", () => {
      onConnect();
    });
    newSocket.on("notification", data => {
      onEvent(data);
      this.mapStore.set("notification", []);
      this.mapStore.set("notification", [data]);
    });
    newSocket.on("disconnect", () => {
      onDisconnect();
    });
    this.socket = newSocket;
  }
  @action
  publish({ channel, value }) {
    return new Promise((resolve, reject) => {
      this.socket.emit(`${channel}`, value, data => {
        return resolve(data);
      });
    });
  }
  @action
  saveNotification(modelName, notificationObject) {
    let notifications = this.mapStore.get(modelName);
    if (!notifications) {
      this.mapStore.set(modelName, []);
      notifications = [];
    }
    let current = this.mapStore.get(modelName);
    this.mapStore.set(modelName, [...current, notificationObject]);
  }
  @action
  removeNotification(modelName, notificationObject) {
    notificationObject.deleted = true;
    this.forceUpdate(modelName);
  }
}

//determine the theme here and load the right login information?
@observer
export class Notification extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let { children, notificationDomainStore, modelName } = this.props;
    // notificationDomainStore.subscribe({
    //   modelName,
    //   port: "5000",
    //   server: "http://localhost",
    //   onInit: () => {
    //     console.log("on init");
    //   },
    //   onConnect: () => {
    //     console.log("on connected");
    //   },
    //   onEvent: data => {
    //     notificationDomainStore.saveNotification(modelName, {
    //       type: "warning",
    //       message: data
    //     });
    //   },
    //   onDisconnect: () => {
    //     console.log("disconnected");
    //   }
    // });
  }
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let { children, notificationDomainStore, modelName } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      return React.cloneElement(child, {
        notifications: notificationDomainStore.mapStore.get(modelName),
        saveNotification: notificationObject =>
          notificationDomainStore.saveNotification(
            modelName,
            notificationObject
          ),
        removeNotification: notificationObject =>
          notificationDomainStore.removeNotification(
            modelName,
            notificationObject
          ),
        ...this.props,
        ...child.props
      });
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}
