import React from "react";
import { Grid } from "@material-ui/core";
import Matter from "matter-js";
import Pendulum from "./Simulations/Pendulum";
import KeyboardEventHandler from "react-keyboard-event-handler";
let fpsInterval = 1000 / 60,
  then = Date.now();
const animate = (onDraw) => {
  // request another frame
  requestAnimationFrame(animate.bind(null, onDraw));
  // calc elapsed time since last loop
  let now = Date.now();
  let elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);
    onDraw();
  }
};
const initMatter = () => {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

  Matter.use("matter-attractors");

  // create engine
  var engine = Engine.create(),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.getElementById("canvas-container"),
    canvas: document.getElementById("my-canvas"),
    engine: engine,
    options: {
      width: 800,
      height: 600,
      background: "#8BE1EB",
      showAngleIndicator: true,
      wireframes: true,
    },
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  var offset = 10,
    options = {
      isStatic: true,
      render: {
        // fillStyle: "#8BE1EB",
      },
    };

  world.bodies = [];

  let s1 = Composites.stack(10, 0, 40, 1, 30, 10, function (x, y) {
    let body = Bodies.rectangle(x, y + 150, 60, 60, {
      isStatic: true,
      isSensor: true,
      render: {
        sprite: {
          texture: "./assets/game/Tiles/tileGrass.png",
        },
      },
    });
    // Matter.Body.rotate(body, Math.PI);
    return body;
  });
  let s2 = Composites.stack(10, 60, 40, 6, 30, 10, function (x, y) {
    let body = Bodies.rectangle(x, y + 150, 60, 60, {
      isStatic: true,
      render: {
        sprite: {
          texture: "./assets/game/Tiles/tileGrass.png",
        },
      },
    });
    Matter.Body.rotate(body, Math.PI / 2);
    return body;
  });

  World.add(world, [
    Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
    Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options),
  ]);

  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 },
  });

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
};
export const Game = ({ grid, phase, currentPlayer, onKeyPress }) => {
  const [paused, setPaused] = React.useState(false);
  const [matterProps, setMatterProps] = React.useState();
  const [position, setPosition] = React.useState();
  React.useEffect(() => {
    const { engine, world, ctx } = initMatter();
    setMatterProps({ engine, world, ctx });
  }, []);
  React.useEffect(() => {
    if (!grid[0] || !grid[0][0]) {
      return;
    }
    const { x, y, direction } = grid[0][0];
    setPosition({ x, y, direction });
  }, [grid]);
  return (
    <Grid
      className="game"
      id="canvas-container"
      container
      style={{
        width: "100%",
        minWidth: "800px",
        overflow: "scroll",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#8BE1EB",
      }}
    >
      <Grid
        style={{
          padding: "2px",
          color: "white",
          textShadow: "black 0px 1px 1px",
          zIndex: 400,
          textAlign: "center",
        }}
        direction="column"
        justify="center"
        container
      >
        <Grid
          style={{
            marginBottom: "5em",
            padding: "3em",
          }}
          item
        >
          <h1>Physics</h1>
          <h3>
            Drag and Drop different objects in the scene using your mouse.
            Discover concepts like Gravity, Newton laws of motion and many other
            phyiscs concepts!
          </h3>
        </Grid>
      </Grid>
      <KeyboardEventHandler
        handleKeys={["all"]}
        onKeyEvent={(key, e) => onKeyPress(key)}
      />
      <Pendulum
        grid={grid}
        {...position}
        {...matterProps}
      />
    </Grid>
  );
};
export default Game;
