import React from "react";
import {
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Icon,
  Button,
  Typography,
} from "@material-ui/core";
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
  const canvas = document.getElementById("my-canvas");
  // module aliases
  const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World;

  // create an engine
  const engine = Engine.create();

  // create a renderer
  const render = Render.create({
    element: document.getElementById("canvas-container"),
    canvas,
    engine: engine,
  });

  // add all of the bodies to the world
  World.add(engine.world, []);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);
  return { Engine, World, Render };
};
export const Game = ({ grid, phase, currentPlayer, onKeyPress }) => {
  const [paused, setPaused] = React.useState(false);
  const [matterProps, setMatterProps] = React.useState();
  React.useEffect(() => {
    // animate(() => {
    //   console.log("ANIMATE");
    // });
    const { Engine, World, Render } = initMatter();
    setMatterProps({ Engine, World, Render });
  }, []);
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
      <Pendulum {...matterProps} />
    </Grid>
  );
};
export default Game;