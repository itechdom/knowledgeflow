import React, { Component } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export default class Game extends Component {
  static propTypes = {
    onLeave: PropTypes.func
  };

  state = {
    user: {},
    fileLocation: null,
    fade: true,
    position: null
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

    // if enough time has elapsed, draw the next frame

    if (elapsed > this.fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.then = now - (elapsed % this.fpsInterval);

      // Put your drawing code here
      // console.log("Hello", this.then);
      this.onDraw();
    }
  };

  vector = ctx => {
    return (ax, ay, bx, by) => {
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    };
  };

  point = (ctx, color) => {
    return (ax, ay, bx, by) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(ax, ay, 5, 0, 2 * Math.PI); // Start point
      ctx.fill();
    };
  };

  draw = vec => {
    const ctx = this.ctx;
    const vectors = vec
      ? vec
      : [
          [5, 50, 300, 70],
          [5, 50, 300, 140],
          [300, 70, 5, 50],
          [300, 70, 5, 140]
        ];
    vectors.map((v, i) => {
      this.vector(ctx)(
        vectors[i][0],
        vectors[i][1],
        vectors[i][2],
        vectors[i][3]
      );
      this.point(ctx, "red")(vectors[i][0], vectors[i][1]);
      // this.point(ctx, "blue")(vectors[i][2], vectors[i][3]);
    });
  };

  init() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    this.camera.position.z = 1;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  drawGrid = (ax, ay, bx, by, increase) => {
    let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    let material = new THREE.MeshNormalMaterial();
    let mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  };

  drawHorizon = (gridVector, i) => {
    this.draw([[gridVector[0] + i, gridVector[1], gridVector[0] + i, 0]]);
  };

  drawBox = () => {};

  drawSphere = () => {};

  componentDidMount() {
    //   let { fileLocation } = this.props;
    //   this.player = new AudioPlayer(`${fileLocation}/music.wav`, () => {
    //     this.stopMusic = this.player.play({
    //       loop: true,
    //       offset: 1,
    //       volume: 0.35
    //     });
    //   });
    //   this.setState({
    //     fade: false
    //   });
    //   this.keyListener.subscribe([
    //     this.keyListener.LEFT,
    //     this.keyListener.RIGHT,
    //     this.keyListener.UP,
    //     this.keyListener.SPACE,
    //     65
    //   ]);
    this.then = Date.now();
    const fps = 60;
    this.fpsInterval = 1000 / fps;
    this.canvas = document.getElementById("my-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.init();
    let increase = 0;
    const gridVector = [5, 50, 300, 150];
    let mesh = this.drawGrid(...gridVector, increase);
    this.onDraw = () => {
      increase++;
      mesh.rotation.x += 0.02;
      mesh.rotation.y += 0.02;
      mesh.rotation.z = mesh.rotation.z > 0 ? 0 : 0.1;
      this.renderer.render(this.scene, this.camera);
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
        <canvas id="my-canvas"></canvas>
      </div>
    );
  }
}
