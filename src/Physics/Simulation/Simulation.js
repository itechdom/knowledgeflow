import React, { Component } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import * as Tone from "tone";
import KeyboardEventHandler from "react-keyboard-event-handler";
import ModelLoader from "../ModelLoader/ModelLoader";
import Physijs from "physijs-webpack";

export default class Simulation extends Component {
  static propTypes = {
    onLeave: PropTypes.func,
  };

  state = {
    user: {},
    fileLocation: null,
    fade: true,
    position: null,
    jumping: false,
    log: {},
  };
  loadModels() {
    ModelLoader("/models/compass.glb")
      .then((gltf) => {
        this.compass = gltf.scene.children;
        this.scene.add(gltf.scene);
      })
      .catch((err) => console.log("error", err));
    // ModelLoader("/models/wire.glb")
    //   .then((gltf) => {
    //     this.wire = gltf.scene.children;
    //     this.scene.add(gltf.scene);
    //     this.wire[2].position.x = 0;
    //     this.wire[2].position.y = 0;
    //     this.wire[2].position.z = 0;
    //     this.wire[2].rotation.y = Math.PI / 2;
    //     for (let i = 0; i < 10; i++) {
    //       let newWire = this.wire[2].clone();
    //       newWire.position.z = (i + 1) * 10;
    //       this.scene.add(newWire);
    //     }
    //   })
    // .catch((err) => console.log("error", err));
  }

  startAnimating(fps) {
    animate();
  }

  animate = () => {
    // request another frame
    requestAnimationFrame(this.animate);

    // calc elapsed time since last loop
    let now = Date.now();
    let elapsed = now - this.then;
    this.elapsed = elapsed;

    // if enough time has elapsed, draw the next frame

    if (elapsed > this.fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.then = now - (elapsed % this.fpsInterval);
      this.onDraw();
    }
  };

  isInverted() {
    return Math.round(this.camera.rotation.y / Math.PI) % 2 === 0;
  }

  playSound() {
    var filter = new Tone.Filter({
      type: "bandpass",
      Q: 12,
    }).toMaster();

    //schedule a series of frequency changes
    filter.frequency.setValueAtTime("C5", 0);
    filter.frequency.setValueAtTime("E5", 0.5);
    filter.frequency.setValueAtTime("G5", 1);
    filter.frequency.setValueAtTime("B5", 1.5);
    filter.frequency.setValueAtTime("C6", 2);
    filter.frequency.linearRampToValueAtTime("C1", 3);

    var noise = new Tone.Noise("brown").connect(filter).start(0).stop(3);

    //schedule an amplitude curve
    noise.volume.setValueAtTime(-20, 0);
    noise.volume.linearRampToValueAtTime(20, 2);
    noise.volume.linearRampToValueAtTime(-Infinity, 3);
  }

  onKeyPress(key) {
    switch (key) {
      case "w":
        this.isInverted()
          ? (this.camera.position.z -= 0.1)
          : (this.camera.position.z += 0.1);
        break;
      case "s":
        this.isInverted()
          ? (this.camera.position.z += 0.1)
          : (this.camera.position.z -= 0.1);
        break;
      case "a":
        this.camera.rotation.y += 0.1;
        break;
      case "d":
        this.camera.rotation.y += -1 * 0.1;
        break;
      case "e":
        this.camera.position.x += this.isInverted() ? 1 * 0.1 : -1 * 0.1;
        // this.grid.rotation.y = this.grid.rotation.y + 1;
        // this.grid.rotation.z = this.grid.rotation.z + 1;
        break;
      case "q":
        this.camera.position.x += this.isInverted() ? -1 * 0.1 : 1 * 0.1;
        break;
      case "c":
        this.camera.position.y += 0.1;
        break;
      case "z":
        this.camera.position.y += -1 * 0.1;
        break;
      case "x":
        this.camera.rotation.z += 0.1;
        break;
      case "v":
        this.camera.rotation.z += -1 * 0.1;
        break;
      case "space":
        this.setState({ jumping: true });
        break;
    }
  }

  init() {
    Element.prototype.remove = function () {
      this.parentElement.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
      for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
          this[i].parentElement.removeChild(this[i]);
        }
      }
    };
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 20;
    this.camera.position.x = 0;
    this.camera.position.y = 1;
    this.scene = new Physijs.Scene();
    this.scene.setGravity(new THREE.Vector3(0, -30, 0));
    this.scene.simulate();
    this.scene.background = new THREE.Color(0xe0e0e0);
    // this.scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.id = "my-canvas";
    // var controls = new THREE.DragControls(this.compass, camera, renderer.domElement);
    // // add event listener to highlight dragged objects
    // controls.addEventListener("dragstart", function (event) {
    //   event.object.material.emissive.set(0xaaaaaa);
    // });
    // controls.addEventListener("dragend", function (event) {
    //   event.object.material.emissive.set(0x000000);
    // });
    // this.synth = new Tone.FMSynth().toMaster();
    document.body.appendChild(this.renderer.domElement);
  }

  drawSkybox = (ax, ay, bx, by, increase) => {};

  drawHemisphereLight = () => {
    var light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    this.scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);
    this.scene.add(light);
    // var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    // this.scene.add(light);
    return light;
  };

  drawFlashLight = () => {
    //color, intensity, distance, decay
    let light = new THREE.PointLight(0xff0000, 1, 100);
    this.scene.add(light);
    return light;
  };

  drawCube = (ax, ay, bx, by, increase) => {
    let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    let material = new THREE.MeshNormalMaterial();
    let mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  };

  drawCone = () => {
    var geometry = new THREE.ConeGeometry(0.1, 1, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var cone = new THREE.Mesh(geometry, material);
    this.scene.add(cone);
    return cone;
  };

  drawSphere = () => {
    var geometry = new THREE.SphereGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshNormalMaterial();
    var sphere = new THREE.Mesh(geometry, material);
    this.scene.add(sphere);
    return sphere;
  };

  drawGround = () => {
    // ground
    var mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);

    var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.grid = grid;
    this.grid.rotation.x = Math.PI / 2;
    this.scene.add(grid);
  };

  drawFloor = () => {
    // var geometry = new THREE.PlaneGeometry(5, 20, 32);
    // var material = new THREE.MeshNormalMaterial();
    // var plane = new THREE.Mesh(geometry, material);
    // var grid = new THREE.GridHelper(100, 10);
    // each square
    var planeW = 50; // pixels
    var planeH = 50; // pixels
    var numW = 50; // how many wide (50*50 = 2500 pixels wide)
    var numH = 50; // how many tall (50*50 = 2500 pixels tall)
    var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW * numW, planeH * numH, planeW, planeH),
      new THREE.MeshPhysicalMaterial({
        color: 0x808080,
        wireframe: true,
      })
    );
    // scene.add(plane);
    this.scene.add(plane);
    return plane;
  };

  rotateWithEntropy(increase, gas) {
    this.compass[3].position.x = gas * Math.sin(Math.sin(increase));
    // this.compass[3].position.y = Math.sin(Math.cos(increase / 30));
    // this.compass[3].rotation.z = (gas * increase) / 30;
    //initial value is used to decrease the rotation angle of the compass
    gas = gas / 1.001;
  }
  //pendulem swing
  swing(increase, gas) {
    // this.compass[3].position.x = 0;
    //multiplying by -1 makes the shape rotate clockwise
    const val1 = gas * Math.sin(-1 * increase);
    const val2 = gas * Math.cos(-1 * increase);
    this.compass[3].position.x = val1;
    this.compass[3].position.y = val2;
    // this.compass[3].position.x = gas * Math.sin(Math.sin(increase));
  }

  componentDidMount() {
    this.init();
    this.then = Date.now();
    const fps = 60;
    this.fpsInterval = 1000 / fps;
    let increase = 0;
    let gas = 1;
    const gridVector = [5, 50, 300, 150];
    let ground = this.drawGround();
    // let light = this.drawFlashLight(...gridVector, increase);
    let HemisphereLight = this.drawHemisphereLight();
    this.loadModels();
    this.onDraw = () => {
      if (this.state.jumping) {
        //this would be gas?
        gas = gas / 1.01;
        this.swing(increase, gas);
      }
      this.renderer.render(this.scene, this.camera);
      this.setState({
        log: {
          other: this.camera,
          position: this.camera.position,
          rotation: this.camera.rotation,
          state: this.state.jumping,
        },
      });
      increase++;
    };
    this.animate();
  }

  componentWillUnmount() {
    this.canvas = document.getElementById("my-canvas");
    this.canvas.remove();
    window.cancelAnimationFrame(this.requestId);
  }

  render() {
    return (
      <div>
        <KeyboardEventHandler
          handleKeys={["all"]}
          onKeyEvent={(key, e) => this.onKeyPress(key)}
        />
        <div style={{ position: "fixed", top: "5em" }}>
          {JSON.stringify(this.state.log)}
        </div>
      </div>
    );
  }
}
