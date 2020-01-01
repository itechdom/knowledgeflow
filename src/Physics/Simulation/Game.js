import React, { Component } from "react";
import PropTypes from "prop-types";
import Matter from "matter-js";
import { AudioPlayer, Loop, Stage, KeyListener, World } from "react-game-kit";
import Character from "./Character";
import Level from "./Level";
import Fade from "./Fade";

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
      console.log("Hello", this.then);
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

  draw = () => {
    const ctx = this.ctx;
    const vectors = [
      [5, 50, 300, 70],
      [5, 50, 300, 148],
      [300, 70, 5, 50],
      [300, 70, 5, 148]
    ];
    vectors.map((v, i) => {
      this.vector(ctx)(
        vectors[i][0],
        vectors[i][1],
        vectors[i][2],
        vectors[i][3]
      );
      this.point(ctx, "red")(vectors[i][0], vectors[i][1]);
      this.point(ctx, "blue")(vectors[i][2], vectors[i][3]);
    });
  };

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
    const fps = 1;
    this.fpsInterval = 1000 / fps;
    this.canvas = document.getElementById("my-canvas");
    this.ctx = this.canvas.getContext("2d");
    // this.animate();
    this.draw(Date.now());
  }

  componentWillUnmount() {
    // this.stopMusic();
    this.keyListener.unsubscribe();
    console.log("unmount", this.requestId);
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

  physicsInit(engine) {
    const ground = Matter.Bodies.rectangle(512 * 3, 448, 1024 * 3, 64, {
      isStatic: true
    });

    const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
      isStatic: true
    });

    const rightWall = Matter.Bodies.rectangle(3008, 288, 64, 576, {
      isStatic: true
    });

    Matter.World.addBody(engine.world, ground);
    Matter.World.addBody(engine.world, leftWall);
    Matter.World.addBody(engine.world, rightWall);
  }

  handleEnterBuilding(index) {
    this.setState({
      fade: true
    });
    setTimeout(() => {
      this.props.onLeave(index);
    }, 500);
  }

  constructor(props) {
    super(props);

    this.state = {
      fade: true
    };
    this.keyListener = new KeyListener();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.context = window.context || new AudioContext();

    this.handleEnterBuilding = this.handleEnterBuilding.bind(this);
  }
}
