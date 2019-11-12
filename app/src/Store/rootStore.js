//Store config
import config from "Config";
// import { offlineStorage } from "Orbital";
import {
  Crud,
  Media,
  Forms,
  Notification,
  EventWithCrud,
  authDomainStore,
  authUiStore,
  socketDomainStore,
  adminDomainStore,
  mediaDomainStore,
  formsDomainStore,
  notificationDomainStore,
  crudDomainStore
} from "@markab.io/react";
import Store from "./Store";
const rootStore = new Store({
  authDomainStore,
  authUiStore,
  crudDomainStore,
  socketDomainStore,
  adminDomainStore,
  mediaDomainStore,
  formsDomainStore,
  notificationDomainStore,
  skipAuth: true,
  config,
  offlineStorage: {
    getItem: () => {
      return new Promise((resolve, reject) => {
        resolve("resolved");
      });
    },
    setItem: () => {
      return new Promise((resolve, reject) => {
        resolve("resolved");
      });
    }
  }
});

export default rootStore;
