import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const loadModel = (path) => {
  // Instantiate a loader
  var loader = new GLTFLoader();

  //   // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  //   var dracoLoader = new DRACOLoader();
  //   dracoLoader.setDecoderPath("/examples/js/libs/draco/");
  //   loader.setDRACOLoader(dracoLoader);

  // Load a glTF resource
  return new Promise((resolve, reject) => {
    loader.load(
      // resource URL
      `http://knowledgeflow.markab.io.s3-website-us-east-1.amazonaws.com${path}`,
      // called when the resource is loaded
      function (gltf) {
        return resolve(gltf);
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        return reject(error);
      }
    );
  });
};

export default loadModel;
