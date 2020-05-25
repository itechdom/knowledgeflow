import React from "react";
import Matter from "matter-js";
import { Grid, Button } from "@material-ui/core";
import { zoom } from "./Camera";
import Render from "../Matter/Render";
import { onGridResize } from "./Axes";
import Gravitation from "./Gravitation";
const origin = 100 * 5;
const factor = 100;
const snapshot = () => {
  let canvas = document.getElementById("axes");
  let image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
  window.location.href = image; // it will save locally
};
const setBackground = (currentZoom) => {
  let canvas = document.getElementById("axes");
  canvas.style.background = `${
    currentZoom <= 0 || currentZoom > 3
      ? "url('/assets/game/background-1x.png')"
      : `url('/assets/game/background-${currentZoom}x.png')`
  }`;
};
const getCartesianCoords = (val) => {
  return val * factor + origin;
};
const FunctionGraph = ({
  initMatter,
  x,
  y,
  direction,
  width,
  height,
  funcs,
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
      restitution: 0.9,
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
    //reference frame
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
      -100 * 10 + 50,
      origin,
      28,
      1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let xAxis = Matter.Bodies.rectangle(x, y, 90, 10, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "red",
            text: {
              content: `${i - 14}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return xAxis;
      }
    );
    xAxis.label = "xAxis";
    let yAxis = Matter.Composites.stack(
      origin,
      -100 * 10 + 50,
      1,
      28,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let yAxis = Matter.Bodies.rectangle(x, y, 10, 90, {
          isStatic: true,
          render: {
            zIndex: 1000,
            fillStyle: "red",
            text: {
              content: `${14 - i}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return yAxis;
      }
    );
    yAxis.label = "yAxis";
    let point = Matter.Bodies.circle(5, 5, 5, {
      isStatic: true,
      render: {
        zIndex: 2000,
        fillStyle: "black",
      },
    });
    Matter.Events.on(engine, "beforeUpdate", () => {
      player.render.text = {
        content: `${((player.position.x - origin) / 100).toFixed(0)},${(
          (-1 * (player.position.y - origin)) /
          100
        ).toFixed(0)}`,
      };
      // if (
      //   render.bounds.min.x > player.position.x ||
      //   render.bounds.min.y > player.position.y ||
      //   player.position.x > render.bounds.max.x ||
      //   player.position.y > render.bounds.max.y
      // ) {
      Render.lookAt(render, {
        min: {
          x: player.position.x - 1000 * currentZoom,
          y: player.position.y - 1000 * currentZoom,
        },
        max: {
          x: player.position.x + 1000 * currentZoom,
          y: player.position.y + 1000 * currentZoom,
        },
      });
      // }
    });
    Matter.World.add(engine.world, [xAxis, yAxis, player]);
    setBounds({ ...render.bounds });
    setPlayer(player);
    setMyEngine({ ...engine, render });
  };
  React.useEffect(() => {
    if (!player || !myEngine) {
      return;
    }
    const { x, y } = player.position;
    const magnitude = 0.09;
    if (direction === "left") {
      return Matter.Body.applyForce(player, { x, y }, { x: -magnitude, y: 0 });
    } else if (direction === "right") {
      return Matter.Body.applyForce(player, { x, y }, { x: magnitude, y: 0 });
    } else if (direction === "up") {
      if (currentZoom < 3) {
        setCurrentZoom(currentZoom + 1);
        // setBackground(currentZoom + 1);
        setBounds({ ...myEngine.render.bounds });
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
        setCurrentZoom(currentZoom - 1);
        // setBackground(currentZoom - 1);
        setBounds({ ...myEngine.render.bounds });
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
      const dim = { width: max.x, height: max.y };
      const rectNumber = dim.width / factor;
      //animate the graph now
      let count = -6;
      let interval = setInterval(() => {
        count++;
        if (count > rectNumber) {
          return clearInterval(interval);
        }
        funcs.map((func) => {
          let point = Matter.Bodies.circle(
            getCartesianCoords(count),
            getCartesianCoords(-1 * func(count)),
            20,
            {
              isStatic: true,
              render: {
                zIndex: 3000,
                fillStyle: "yellow",
                text: {
                  content: `${Math.cos(count).toFixed(2)}`,
                  size: 12,
                  color: "#FFF",
                },
              },
            }
          );
          return Matter.World.add(myEngine.world, point);
        });
      }, 250);
    }
  }, [bounds]);
  React.useEffect(() => {
    init({
      wireframes: false,
      // background: "url('/assets/game/background-1x.png')",
      background: "#000000",
      showAngleIndicator: false,
      width: 2000,
      height: 2000,
    });
  }, []);
  return (
    <Grid item style={{ marginTop: "10px", marginBottom: "10em" }}>
      <Grid alignItems="center" justify="center" container id="axes-container">
        <Grid xs={12} item>
          <canvas id="axes"></canvas>
          {myEngine && (
            <Gravitation
              initMatter={() => {
                return {
                  engine: myEngine,
                  Render: Render,
                  render: myEngine.render,
                };
              }}
            />
          )}
          <Button onClick={() => snapshot()}>snapshot</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default FunctionGraph;
