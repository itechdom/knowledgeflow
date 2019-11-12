import React from "react";
class CameraView extends React.Component {
  constructor(props) {
    super(props);
  }
  onSuccess = data => {
    this.props.onData(data);
  };
  onFail = err => {
    this.props.onError(message);
  };
  componentDidMount() {
    const { sourceType, onData, onError, ...rest } = this.props;
    const Camera = navigator.camera;
    Camera.getPicture(this.onSuccess, this.onFail, {
      saveToPhotoAlbum: true,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      encodingType: Camera.EncodingType.PNG
    });
  }
  componentWillUnmount() {}
  render() {
    return <></>;
  }
}
export default CameraView;
