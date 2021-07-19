import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
const origin = 100 * 5;
const factor = 100;
let rangeX;
let rangeY;
const colors = ["#2E89BC", "#2F496D", "#EE8B73", "#F4EADE"];
const cartesian = (cartesianCoordinate) => {
  return cartesianCoordinate * factor + origin;
};
const toCartesian = (coordinate) => {
  return (coordinate - origin) / factor;
};
const checkBoundsX = (render, onExpansion) => {
  let rangeMin = (rangeX && rangeX[0]) || -1;
  let rangeMax = (rangeX && rangeX[1]) || 1;
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
  let rangeMin = (rangeY && rangeY[0]) || -1;
  let rangeMax = (rangeY && rangeY[1]) || 1;
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
  const [currentZoom, setCurrentZoom] = React.useState(2);
  const [bounds, setBounds] = React.useState({});
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
      cartesian(-1 * boundry[1] - 0.5),
      cartesian(0),
      boundry[1] * 2 + 1,
      1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let xAxis = Matter.Bodies.rectangle(x, y, 90, 10, {
          isStatic: true,
          isSensor: true,
          render: {
            zIndex: 2000,
            fillStyle: colors[1],
            text: {
              content: `${i - boundry[1]}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return xAxis;
      }
    );
    xAxis.label = "xAxis";
    let yAxisBoundry = Matter.Composites.stack(
      cartesian(-1 * boundry[1] - 0.5),
      cartesian(-1 * boundry[1]),
      boundry[1] * 2 + 1,
      1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let yAxisBoundry = Matter.Bodies.rectangle(x, y, 90, 10, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "rgba(255, 255, 255, 0.1)",
            text: {
              // content: `${i - boundry[1]}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return yAxisBoundry;
      }
    );
    yAxisBoundry.label = "yAxisBoundry";
    let yAxisBoundryBottom = Matter.Composites.stack(
      cartesian(-1 * boundry[1] - 0.5),
      cartesian(boundry[1] + 0.5),
      boundry[1] * 2 + 1,
      1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let yAxisBoundryBottom = Matter.Bodies.rectangle(x, y, 90, 10, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "rgba(255, 255, 255, 0.1)",
            text: {
              // content: `${i - boundry[1]}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return yAxisBoundryBottom;
      }
    );
    yAxisBoundryBottom.label = "yAxisBoundryBottom";
    let yAxis = Matter.Composites.stack(
      cartesian(0),
      cartesian(-1 * boundry[1] - 0.5),
      1,
      boundry[1] * 2 + 1,
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
              content: `${-1 * (i - boundry[1])}`,
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
    let xAxisBoundry = Matter.Composites.stack(
      cartesian(-1 * boundry[1] - 0.5),
      cartesian(-1 * boundry[1] - 0.5),
      1,
      boundry[1] * 2 + 1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let xAxisBoundry = Matter.Bodies.rectangle(x, y, 10, 90, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "rgba(255, 255, 255, 0.1)",
            text: {
              // content: `${i - boundry[1]}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return xAxisBoundry;
      }
    );
    xAxisBoundry.label = "xAxisBoundry";
    let xAxisBoundryRight = Matter.Composites.stack(
      cartesian(boundry[1] + 0.5),
      cartesian(-1 * boundry[1] - 0.125),
      1,
      boundry[1] * 2 + 1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let xAxisBoundry = Matter.Bodies.rectangle(x, y, 10, 90, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "rgba(255, 255, 255, 0.1)",
            text: {
              // content: `${i - boundry[1]}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return xAxisBoundry;
      }
    );
    xAxisBoundryRight.label = "xAxisBoundryRight";
    Matter.Events.on(engine, "beforeUpdate", () => {
      player.render.text = {
        content: `${toCartesian(player.position.x).toFixed(1)},${(
          -1 * toCartesian(player.position.y)
        ).toFixed(1)}`,
      };
      // if (
      //   Math.floor(toCartesian(player.position.x)) === -1 * (boundry[1] + 5) ||
      //   Math.floor(toCartesian(player.position.x)) === boundry[1] + 5 ||
      //   Math.floor(-1 * toCartesian(player.position.y)) === -1 * boundry[1] ||
      //   Math.floor(-1 * toCartesian(player.position.y)) === boundry[1]
      // ) {
      //   Matter.Body.setPosition(player, {
      //     x: cartesian(0),
      //     y: cartesian(0),
      //   });
      // }
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
      yAxisBoundry,
      yAxisBoundryBottom,
      xAxisBoundry,
      xAxisBoundryRight,
    ]);
    setBounds({ ...render.bounds });
  };
  React.useEffect(() => {
    if (bounds.min) {
      let playerPosition = player.position;
      funcs.map((func, i) => {
        let x = Math.ceil(playerPosition.x / factor - origin / factor);
        let y = func(x);
        let point = Matter.Bodies.circle(cartesian(x), cartesian(-1 * y), 25, {
          isStatic: true,
          render: {
            zIndex: 3000,
            fillStyle: colors[2],
            text: {
              content: `${x},${func(x).toFixed(1)}`,
              size: 18,
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
    <Grid item>
      <></>
    </Grid>
  );
};
export default FunctionGraph;
