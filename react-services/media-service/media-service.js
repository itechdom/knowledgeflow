import { observer } from "mobx-react";
import { observable, action, runInAction, toJS } from "mobx";
import React from "react";
import axios from "axios";

//export store
export class mediaDomainStore {
  modelName;
  gallery = observable.map();
  media = observable.map();
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
  uploadMedia({ modelName, extension, files, modelId, isMultiple, subRoute }) {
    let formData = new FormData();
    files.map((file, i) => {
      let blob = new Blob([file], { type: extension }); // WORKS much better (if you know what MIME type you want.
      let fileType = extension.replace("image/", ".");
      formData.append(modelName + fileType, blob, file.name.split(".")[0]);
    });
    let route = isMultiple
      ? `${subRoute ? subRoute : "/"}gallery`
      : `${subRoute ? subRoute : "/"}media`;
    return this.offlineStorage.getItem("jwtToken").then(token => {
      return axios
        .post(
          `${this.SERVER.host}:${
            this.SERVER.port
          }/${modelName}${route}?token=${token}&query=${modelId}`,
          formData,
          {
            headers: { "content-type": "multipart/form-data" }
          }
        )
        .then(res => {
          console.log("response from media", res);
          return res;
        })
        .catch(err => {
          return this.setError(err);
        });
    });
  }
  deleteMedia({ modelName, modelId, fileName, subRoute }) {
    //fileName is just a link, extract image
    let splitArray = fileName.split("/");
    let originalFileName = splitArray[splitArray.length - 1];
    let file = originalFileName.split("?")[0];
    subRoute = "/remove/";
    let route = `${subRoute ? subRoute : "/"}media`;
    return this.offlineStorage.getItem("jwtToken").then(token => {
      return axios
        .delete(
          `${this.SERVER.host}:${
            this.SERVER.port
          }/${modelName}${route}?token=${token}&query=${modelId}&fileName=${file}`
        )
        .then(res => {
          console.log("response from media", res);
          return res;
        })
        .catch(err => {
          return this.setError(err);
        });
    });
  }
  @action
  setError(err) {
    console.error(err);
  }
}

const injectProps = ({
  mediaDomainStore,
  modelName,
  props,
  child,
  extension,
  subRoute
}) => {
  let injected = {
    ...props,
    ...child.props
  };
  injected[`${modelName}_gallery`] = mediaDomainStore.gallery.get(modelName);
  injected[`${modelName}_gallery_upload`] = (modelId, files) =>
    mediaDomainStore.uploadMedia({
      modelName,
      extension,
      isMultiple: true,
      files,
      modelId,
      subRoute
    });
  injected[`${modelName}_media`] = mediaDomainStore.media.get(modelName);
  injected[`${modelName}_media_upload`] = (modelId, files) =>
    mediaDomainStore.uploadMedia({
      modelName,
      extension,
      isMultiple: false,
      files,
      modelId,
      subRoute
    });
  injected[`${modelName}_media_delete`] = (modelId, fileName) =>
    mediaDomainStore.deleteMedia({
      modelName,
      modelId,
      fileName,
      subRoute
    });
  return injected;
};

//determine the theme here and load the right login information?
@observer
export class Media extends React.Component {
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
      mediaDomainStore,
      extension,
      subRoute
    } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps({
        mediaDomainStore,
        modelName,
        props: this.props,
        child,
        extension,
        subRoute
      });
      return React.cloneElement(child, injectedProps);
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}
