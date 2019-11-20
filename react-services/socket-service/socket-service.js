import { observer } from "mobx-react";
import { observable, action, runInAction, toJS } from "mobx";
import React from "react";
import axios from "axios";
import io from "socket.io-client";

//export store
export class socketDomainStore {
  @observable
  isConnected = false;
  socket;
  rootStore;
  SERVER;
  mapStore = observable.map();
  constructor(rootStore, SERVER) {
    this.rootStore = rootStore;
    this.SERVER = SERVER;
  }
  @action
  subscribe({ onInit, onConnect, onEvent, onDisconnect, channel, port }) {
    const domainName = `${this.SERVER.socket}:${port}/${channel}`;
    let newSocket = io(domainName);
    newSocket.on("init", data => {
      onInit(data);
    });
    newSocket.on("connect", () => {
      onConnect();
    });
    newSocket.on(channel, data => {
      onEvent(data);
      this.mapStore.set(channel, []);
      this.mapStore.set(channel, [data]);
    });
    newSocket.on("disconnect", () => {
      onDisconnect();
    });
    this.socket = newSocket;
  }
  @action
  publish({ channel, value }) {
    console.log(channel, value);
    return new Promise((resolve, reject) => {
      this.socket.emit(`${channel}`, value, data => {
        return resolve(data);
      });
    });
  }
  @action
  publishUpdate({ channel, value }) {
    return new Promise((resolve, reject) => {
      this.socket.emit(`${channel}-update`, value, data => {
        return resolve(data);
      });
    });
  }
  @action
  publishDelete({ channel, value }) {
    console.log("publish delete", channel, value);
    return new Promise((resolve, reject) => {
      this.socket.emit(`${channel}-delete`, value, data => {
        return resolve(data);
      });
    });
  }
}

const injectProps = (socketDomainStore, channel, props, child) => {
  let injected = {
    channel: channel,
    publish: value => socketDomainStore.publish({ value, channel }),
    subscribe: ({ onConnect, onEvent, onDisconnect, channel, onInit, port }) =>
      socketDomainStore.subscribe({
        onConnect,
        onEvent,
        onDisconnect,
        channel,
        onInit,
        port
      }),
    ...props,
    ...child.props
  };
  injected[`incoming_${channel}`] = socketDomainStore.mapStore.get(channel);
  injected[`${channel}_update`] = value =>
    socketDomainStore.publishUpdate({ channel, value });
  injected[`${channel}_delete`] = value =>
    socketDomainStore.publishDelete({ channel, value });
  return injected;
};

//determine the theme here and load the right login information?
@observer
export class Socket extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let { channel, children, socketDomainStore } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(
        socketDomainStore,
        channel,
        this.props,
        child
      );
      return React.cloneElement(child, injectedProps);
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}
