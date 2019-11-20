import { observer } from "mobx-react";
import { observable, action, runInAction, toJS } from "mobx";
import React from "react";

//export store
export class gameDomainStore {
  @observable
  characterPosition = { x: 0, y: 0 };
  @observable
  stageX = 0;
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
    this.setCharacterPosition = this.setCharacterPosition.bind(this);
    this.setStageX = this.setStageX.bind(this);
  }

  @action
  setCharacterPosition(position) {
    this.characterPosition = position;
  }

  @action
  setStageX(x) {
    if (x > 0) {
      this.stageX = 0;
    } else if (x < -2048) {
      this.stageX = -2048;
    } else {
      this.stageX = x;
    }
  }
}

//determine the theme here and load the right login information?
@observer
export class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  render() {
    let { gameDomainStore, children, ...rest } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      return React.cloneElement(child, {
        characterPosition: gameDomainStore.characterPosition,
        setCharacterPosition: gameDomainStore.setCharacterPosition,
        setStageX: gameDomainStore.setStageX,
        stageX: gameDomainStore.stageX,
        ...child.props,
        ...rest
      });
    });
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}
