import React from "react";
import Matter from "matter-js";
import { Grid, Button } from "@material-ui/core";
import { zoom } from "./Camera";
import Render from "../Matter/Render";
import { onGridResize } from "./Axes";
const snapshot = () => {
  let canvas = document.getElementById("axes");
  let image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
  window.location.href = image; // it will save locally
};
const setBackground = (currentZoom) => {
  let canvas = document.getElementById("axes");
  console.log(currentZoom);
  canvas.style.background = `${
    currentZoom <= 0 || currentZoom > 3
      ? "url('/assets/game/background-1x.png')"
      : `url('/assets/game/background-${currentZoom}x.png')`
  }`;
};
const FunctionGraph = ({
  initMatter,
  x,
  y,
  direction,
  showX,
  showY,
  width,
  height,
  fn,
  ...rest
}) => {
  const [myEngine, setMyEngine] = React.useState();
  const [player, setPlayer] = React.useState();
  const [iter, setIter] = React.useState(0);
  const [currentZoom, setCurrentZoom] = React.useState(1);
  const [bounds, setBounds] = React.useState({});
  const init = (options) => {
    const { engine, mouse, render, Render } = initMatter(
      "axes",
      "axes-container",
      options,
      true,
      {
        render: {
          zIndex: 100,
          fillStyle: "red",
          sprite: {
            // texture: "./assets/game/Tiles/dirt.png",
          },
        },
      }
    );
    let player = Matter.Bodies.circle(400, 100, 50, {
      restitution: 1,
      render: {
        zIndex: 9000,
        // sprite: {
        //   // texture: "./assets/game/Tiles/alienBeige.png",
        // },
        // text: {
        //   content: "Test",
        //   size: 16,
        //   color: "#FFF",
        //   family: "Ariel",
        // },
      },
    });
    player.isPlayer = true;
    let grid = Matter.Composites.stack(
      2.5,
      2.5,
      10,
      10,
      5,
      5,
      (x, y, column, row, lastBody, i) => {
        //restitution is the ratio of end velocity to beginning velocity
        let circle1 = Matter.Bodies.rectangle(x, y, 95, 95, {
          restitution: 0,
          isStatic: true,
          isSensor: true,
          angle: 0,
          mass: 0,
          render: {
            fillStyle: "black",
            strokeStyle: "white",
            sprite: {
              // texture: "assets/game/Tiles/tileGrass.png",
            },
            zindex: -1,
          },
        });
        return circle1;
      }
    );
    grid.label = "grid";
    let xAxis = Matter.Composites.stack(
      -40,
      99 * 5,
      20,
      1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let xAxis = Matter.Bodies.rectangle(x, y, 90, 30, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "red",
            text: {
              content: `${i - 5}`,
              size: 22,
              color: "#FFF",
              family: "Ariel",
            },
          },
        });
        return xAxis;
      }
    );
    let yAxis = Matter.Composites.stack(
      99 * 5,
      -40,
      1,
      20,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let yAxis = Matter.Bodies.rectangle(x, y, 30, 90, {
          isStatic: true,
          render: {
            zIndex: 1000,
            fillStyle: "red",
            text: {
              content: `${5 - i}`,
              size: 22,
              color: "#FFF",
            },
          },
        });
        return yAxis;
      }
    );
    let point = Matter.Bodies.circle(5, 5, 5, {
      isStatic: true,
      render: {
        zIndex: 2000,
        fillStyle: "black",
      },
    });
    // setBackground();
    Matter.World.add(engine.world, [xAxis, yAxis, player]);
    setBounds(render.bounds);
    setPlayer(player);
    setMyEngine({ ...engine, render });
  };
  React.useEffect(() => {
    if (!player || !myEngine) {
      return;
    }
    const { x, y } = player.position;
    const magnitude = 0.1;
    if (direction === "left") {
      return Matter.Body.applyForce(player, { x, y }, { x: -magnitude, y: 0 });
    } else if (direction === "right") {
      return Matter.Body.applyForce(player, { x, y }, { x: magnitude, y: 0 });
    } else if (direction === "up") {
      if (currentZoom < 3) {
        zoom(
          Render,
          myEngine.render,
          -currentZoom * 1000,
          currentZoom * 1000 + 1000
        );
        setCurrentZoom(currentZoom + 1);
        setBackground(currentZoom + 1);
      }
      // let newGrid = onGridResize({ myEngine });
      // Matter.World.add(myEngine.world, newGrid);
      return Matter.Body.applyForce(
        player,
        { x, y },
        { x: 0, y: -magnitude * 2 }
      );
    } else if (direction === "down") {
      if (currentZoom > 0) {
        zoom(
          Render,
          myEngine.render,
          -1 * (currentZoom - 1) * 1000,
          (currentZoom - 1) * 1000 + 1000
        );
        document.body.style.backgroundImage = "url('img_tree.png')";
        setCurrentZoom(currentZoom - 1);
        setBackground(currentZoom - 1);
      }
      return Matter.Body.applyForce(
        player,
        { x, y },
        { x: 0, y: magnitude * 2 }
      );
    }
  }, [direction, x, y]);
  React.useEffect(() => {
    //range
    if (bounds.min) {
      let { min, max } = bounds;
      const factor = 10;
      const position = { x: min.x, y: min.y };
      const dim = { width: max.x, height: max.y };
      const rectNumber = dim.width / factor;
      //animate the graph now
      let count = 0;
      let interval = setInterval(() => {
        count++;
        if (count > rectNumber) {
          return clearInterval(interval);
        }
        //render new point
        let point1 = Matter.Bodies.circle(0, count * factor, 5, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "black",
          },
        });
        let point2 = Matter.Bodies.circle(count * factor, 0, 5, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "black",
          },
        });
        let point3 = Matter.Bodies.circle(count * factor, count * factor, 5, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "black",
          },
        });
        let point4 = Matter.Bodies.circle(
          Math.sin(count) * factor + factor * 2,
          Math.cos(count) * factor + factor * 2,
          5,
          {
            isStatic: true,
            render: {
              zIndex: 2000,
              fillStyle: "white",
            },
          }
        );
        return Matter.World.add(myEngine.world, [
          // point1,
          // point2,
          // point3,
          point4,
        ]);
      }, 250);
    }
  }, [bounds]);
  React.useEffect(() => {
    init({
      wireframes: false,
      background: "url('/assets/game/background-1x.png')",
      showAngleIndicator: false,
      width: 1000,
      height: 1000,
    });
  }, []);
  return (
    <Grid item style={{ marginTop: "10px", marginBottom: "10em" }}>
      <Grid alignItems="center" justify="center" container id="axes-container">
        <Grid xs={12} item>
          <canvas id="axes"></canvas>
          <Button onClick={() => snapshot()}>snapshot</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default FunctionGraph;
