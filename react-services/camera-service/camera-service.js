import React from "react";
import Webcam from "react-webcam";

const injectProps = (modelName, capture, child) => {
  let injected = {
    ...props,
    ...child.props
  };
  injected[`${modelName}_capture`] = capture;
  return injected;
};

//determine the theme here and load the right login information?
const Camera = ({ modelName, children, width, height, onCapture }) => {
  const videoConstraints = {
    width,
    height,
    facingMode
  };
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef]);
  const childrenWithProps = React.Children.map(children, child => {
    let injectedProps = injectProps(modelName, capture, child);
    return React.cloneElement(child, { ...injectedProps });
  });
  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={width}
        height={height}
        videoConstraints={videoConstraints}
      />
      {childrenWithProps}
    </>
  );
};

export default Camera;
