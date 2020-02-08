import React, { Component } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import * as Tone from "tone";
import KeyboardEventHandler from "react-keyboard-event-handler";

export default class Game extends Component {
  static propTypes = {
    onLeave: PropTypes.func
  };

  state = {
    user: {},
    fileLocation: null,
    fade: true,
    position: null,
    jumping: false,
    log: {}
  };

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
      Q: 12
    }).toMaster();

    //schedule a series of frequency changes
    filter.frequency.setValueAtTime("C5", 0);
    filter.frequency.setValueAtTime("E5", 0.5);
    filter.frequency.setValueAtTime("G5", 1);
    filter.frequency.setValueAtTime("B5", 1.5);
    filter.frequency.setValueAtTime("C6", 2);
    filter.frequency.linearRampToValueAtTime("C1", 3);

    var noise = new Tone.Noise("brown")
      .connect(filter)
      .start(0)
      .stop(3);

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
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 0;
    this.camera.position.x = 0;
    this.camera.position.y = 1;
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.synth = new Tone.FMSynth().toMaster();
    document.body.appendChild(this.renderer.domElement);
  }

  drawSkybox = (ax, ay, bx, by, increase) => {};

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

  drawFloor = () => {
    // var geometry = new THREE.PlaneGeometry(5, 20, 32);
    // var material = new THREE.MeshNormalMaterial();
    // var plane = new THREE.Mesh(geometry, material);
    var grid = new THREE.GridHelper(100, 10);
    this.scene.add(grid);
    return grid;
  };

  componentDidMount() {
    this.init();
    this.then = Date.now();
    const fps = 60;
    this.fpsInterval = 1000 / fps;
    this.canvas = document.getElementById("my-canvas");
    this.ctx = this.canvas.getContext("2d");
    let increase = 0;
    const gridVector = [5, 50, 300, 150];
    let mesh = this.drawCube(...gridVector, increase);
    let sphere = this.drawSphere(...gridVector, increase);
    let floor = this.drawFloor(...gridVector, increase);
    let light = this.drawFlashLight(...gridVector, increase);
    let cone = this.drawCone(...gridVector, increase);
    this.camera.add(cone);
    cone.position.set(0, 0, -10);
    this.onDraw = () => {
      if (this.state.jumping) {
        this.camera.position.x = Math.sin(increase / 30);
        // this.camera.position.z = Math.cos(increase / 30);
        // this.playSound();
      }
      mesh.rotation.x += 0.02;
      mesh.rotation.y += 0.02;
      sphere.position.x = Math.sin(increase / 30);
      sphere.position.y = Math.cos(increase / 30);
      let { x, y, z } = this.camera.position;
      this.renderer.render(this.scene, this.camera);
      cone.rotation.set(-Math.PI / 16, 0, 0);
      this.setState({
        log: {
          other: this.camera,
          position: this.camera.position,
          rotation: this.camera.rotation,
          state: this.state.jumping
        }
      });
      increase++;
    };
    this.animate();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.requestId);
  }

  render() {
    let {
      stageX,
      characterPosition,
      setStageX,
      setCharacterPosition,
      fileLocation
    } = this.props;

    return (
      <div
        style={{
          width: "300px",
          marginTop: "100px",
          marginLeft: "100px",
          border: "1px solid black"
        }}
      >
        <KeyboardEventHandler
          handleKeys={["all"]}
          onKeyEvent={(key, e) => this.onKeyPress(key)}
        />
        <div>{JSON.stringify(this.state.log)}</div>
        <canvas id="my-canvas"></canvas>
      </div>
    );
  }
}
