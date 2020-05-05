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
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

  // create engine
  var engine = Engine.create(),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      background: "#0f0f13",
      showAngleIndicator: false,
      wireframes: false,
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
    };

  world.bodies = [];

  // these static walls will not be rendered in this sprites example, see options
  World.add(world, [
    Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
    Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options),
  ]);

  var stack = Composites.stack(20, 20, 10, 4, 0, 0, function (x, y) {
    if (Common.random() > 0.35) {
      return Bodies.rectangle(x, y, 64, 64, {
        render: {
          strokeStyle: "#ffffff",
          sprite: {
            texture: "./assets/game/Tiles/tileDirt_full.png",
          },
        },
      });
    } else {
      return Bodies.circle(x, y, 46, {
        density: 0.0005,
        frictionAir: 0.06,
        restitution: 0.3,
        friction: 0.01,
        render: {
          sprite: {
            texture: "./assets/game/Tiles/alienBeige.png",
          },
        },
      });
    }
  });

  World.add(world, stack);

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
      <KeyboardEventHandler
        handleKeys={["all"]}
        onKeyEvent={(key, e) => onKeyPress(key)}
      />
      <canvas id="my-canvas"></canvas>
      <Pendulum grid={grid} animate={animate} {...position} {...matterProps} />
      <img
        style={{ display: "none" }}
        id="tile-1"
        src={grid && grid[0] && grid[0][0].tile}
        width="300"
        height="300"
      />
    </Grid>
  );
};
export default Game;
