import React from "react";
import Matter from "matter-js";
import { Grid, Button } from "@material-ui/core";
const origin = 100 * 5;
const factor = 100;
let interval;
let rangeX;
let rangeY;
// const colors = ["#1D1F26", "#283655", "#4D648D", "#D0E1F9"];
// const colors = ["#F7EFE2", "#EA4235", "#EC5D33", "#F5A62A"];
const colors = ["#4896D8", "#FEDB5B", "#ED6B56", "#F39F54"];
// const colors = ["#EAE2D6", "#E1B81B", "#867666", "#D5C3AA"];
// const colors = ["#B6452C", "#301B28", "#523634", "#DDC5A1"];
// const colors = ["#2E89BC", "#2F496D", "#EE8B73", "#F4EADE"];
// const colors = ["#EEB83E", "#010C29", "#D83D30", "#F9F5F2"];
function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
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
//convert cartesian coord to our world's coordinates
const cartesian = (cartesianCoordinate) => {
  return cartesianCoordinate * factor + origin;
};
const checkBoundsX = (render, onExpansion) => {
  let rangeMin = (rangeX && rangeX[0]) || -13;
  let rangeMax = (rangeX && rangeX[1]) || 13;
  let boundMin = render.bounds.min.x;
  let boundMax = render.bounds.max.x;
  let newBoundMin = Math.ceil(boundMin / factor);
  let newBoundMax = Math.ceil(boundMax / factor);
  if (newBoundMin < rangeMin) {
    rangeX = [newBoundMin, rangeMax];
    onExpansion(rangeX);
  }
  if (newBoundMax > rangeMax) {
    rangeX = [rangeMin, newBoundMax];
    onExpansion(rangeX);
  }
};
const checkBoundsY = (render, onExpansion) => {
  let rangeMin = (rangeY && rangeY[0]) || -14;
  let rangeMax = (rangeY && rangeY[1]) || 14;
  let boundMin = render.bounds.min.y;
  let boundMax = render.bounds.max.y;
  let newBoundMin = Math.ceil(boundMin / factor);
  let newBoundMax = Math.ceil(boundMax / factor);
  if (newBoundMin < rangeMin) {
    rangeY = [newBoundMin, rangeMax];
    onExpansion(rangeY);
  }
  if (newBoundMax > rangeMax) {
    rangeY = [rangeMin, newBoundMax];
    onExpansion(rangeY);
  }
};
const FunctionGraph = ({
  x,
  y,
  direction,
  width,
  height,
  funcs,
  player,
  onUpdateBounds,
  engine,
  render,
  Render,
  boundry,
  ...rest
}) => {
  const [iter, setIter] = React.useState(0);
  const [currentZoom, setCurrentZoom] = React.useState(1);
  const [bounds, setBounds] = React.useState({});
  const prevBounds = usePrevious(bounds);
  const init = () => {
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
            fillStyle: colors[0],
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
      (-100 * boundry[1]) / 4 - 50,
      origin,
      boundry[1],
      1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let xAxis = Matter.Bodies.rectangle(x, y, 90, 10, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: colors[1],
            text: {
              content: `${i - boundry[1] / 2}`,
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
      (-100 * boundry[1]) / 4 - 50,
      1,
      boundry[1],
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let yAxis = Matter.Bodies.rectangle(x, y, 10, 90, {
          isStatic: true,
          isSensor: true,
          render: {
            zIndex: 1000,
            fillStyle: colors[2],
            text: {
              content: `${boundry[1] / 2 - i}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        yAxis.strokeStyle = "#FFF";
        return yAxis;
      }
    );
    yAxis.label = "yAxis";
    let boundryBox = Matter.Composites.stack(
      cartesian(boundry[0]),
      origin,
      2,
      1,
      1,
      1,
      (x, y, column, row, lastBody, i) => {
        let box = Matter.Bodies.rectangle(
          x + i * cartesian(boundry[1]),
          y - boundry[1] * 100,
          10,
          boundry[1] * 100,
          {
            isStatic: true,
            isSensor: i === 0,
            render: {
              zIndex: 100,
              fillStyle: colors[0],
              text: {
                content: `${i === 0 ? "Begin!" : "End!"}`,
                size: 18,
                color: "#FFF",
              },
            },
          }
        );
        box.label = i;
        return box;
      }
    );
    let boundryBoxTop = Matter.Composites.stack(
      origin,
      cartesian(boundry[0]),
      1,
      2,
      1,
      1,
      (x, y, column, row, lastBody, i) => {
        let box = Matter.Bodies.rectangle(
          x,
          y - i * boundry[1] * 100,
          width,
          10,
          {
            isStatic: true,
            render: {
              zIndex: 200,
              fillStyle: colors[0],
              text: {
                content: `${i === 0 ? "" : ""}`,
                size: 18,
                color: "#FFF",
              },
            },
          }
        );
        box.label = i;
        return box;
      }
    );
    Matter.Events.on(engine, "beforeUpdate", () => {
      player.render.text = {
        content: `${((player.position.x - origin) / 100).toFixed(1)},${(
          (-1 * (player.position.y - origin)) /
          100
        ).toFixed(1)}`,
      };
      if (player.velocity.x > 5) {
        Matter.Body.setVelocity(player, {
          x: 5,
          y: player.velocity.y,
        });
      }
      if (player.velocity.y > 5) {
        Matter.Body.setVelocity(player, {
          x: player.velocity.x,
          y: 5,
        });
      }
      Render.lookAt(render, {
        min: {
          x: player.position.x - (width / 2) * currentZoom,
          y: player.position.y - (height / 2) * currentZoom,
        },
        max: {
          x: player.position.x + (width / 2) * currentZoom,
          y: player.position.y + (height / 2) * currentZoom,
        },
      });
      //check if we exceed the x axis
      checkBoundsX(render, (newBounds) => {
        setBounds({
          min: { x: cartesian(newBounds[0]), y: render.bounds.min.y },
          max: { x: cartesian(newBounds[1]), y: render.bounds.max.y },
        });
      });
      checkBoundsY(render, (newBounds) => {
        setBounds({
          min: { y: cartesian(newBounds[0]), x: render.bounds.min.x },
          max: { y: cartesian(newBounds[1]), x: render.bounds.max.x },
        });
      });
    });
    Matter.World.add(engine.world, [
      xAxis,
      yAxis,
      boundryBox,
      boundryBoxTop,
      grid,
    ]);
    setBounds({ ...render.bounds });
  };
  //this effect will draw only when the boundries change
  React.useEffect(() => {
    if (interval) {
      clearInterval(interval);
    }
    //range
    if (bounds.min) {
      let { min: minPrev, max: maxPrev } = prevBounds;
      let { min, max } = bounds;
      let playerPosition = player.position;
      funcs.map((func) => {
        let x = Math.ceil(playerPosition.x / factor - origin / factor);
        let y = func(x);
        let point = Matter.Bodies.circle(cartesian(x), cartesian(-1 * y), 2, {
          isStatic: true,
          render: {
            zIndex: 3000,
            fillStyle: "black",
            text: {
              content: `${x},${func(x).toFixed(1)}`,
              size: 12,
              color: "#FFF",
            },
          },
        });
        Matter.World.add(engine.world, point);
        onUpdateBounds && onUpdateBounds();
      });
    }
  }, [bounds]);
  React.useEffect(() => {
    if (engine) {
      init();
    }
  }, []);
  return (
    <Grid item style={{ marginTop: "10px", marginBottom: "10em" }}>
      <Grid alignItems="center" justify="center" container id="axes-container">
        <Grid xs={12} item>
          <canvas id="axes"></canvas>
          {/* <Button onClick={() => snapshot()}>snapshot</Button> */}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default FunctionGraph;
