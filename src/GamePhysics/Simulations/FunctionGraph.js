import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
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
  const [bounds, setBounds] = React.useState({});
  const init = (options) => {
    const { engine, mouse, render, Render } = initMatter(
      "axes",
      "axes-container",
      options,
      false,
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
      5,
      5,
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
            fillStyle: "white",
            strokeStyle: "black",
            sprite: {
              // texture: "assets/game/Tiles/tileGrass.png",
            },
            zindex: -1,
          },
        });
        return circle1;
      }
    );
    let xAxis = Matter.Composites.stack(
      -45,
      99 * 5,
      20,
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
      -45,
      1,
      20,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let yAxis = Matter.Bodies.rectangle(x, y, 10, 90, {
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
    Matter.World.add(engine.world, [player, grid, xAxis, yAxis, point]);
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
      return Matter.Body.applyForce(
        player,
        { x, y },
        { x: 0, y: -magnitude * 2 }
      );
    } else if (direction === "down") {
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
      const position = { x: min.x, y: min.y };
      const dim = { width: max.x, height: max.y };
      const rectNumber = dim.width / 100;
      //animate the graph now
      let count = 0;
      let interval = setInterval(() => {
        count++;
        if (count > rectNumber) {
          return clearInterval(interval);
        }
        //render new point
        let point1 = Matter.Bodies.circle(0, count * 100, 5, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "black",
          },
        });
        let point2 = Matter.Bodies.circle(count * 100, 0, 5, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "black",
          },
        });
        return Matter.World.add(myEngine.world, [point1, point2]);
      }, 500);
    }
  }, [bounds]);
  React.useEffect(() => {
    init({
      wireframes: false,
      background: "#FFF",
      showAngleIndicator: false,
      width: 1000,
      height: 1000,
    });
  }, []);
  return (
    <Grid item style={{ marginTop: "10px", marginBottom: "10em" }}>
      <Grid alignItems="center" justify="center" container id="axes-container">
        <Grid xs={12} item>
          <canvas style={{ fontSize: "24px" }} id="axes"></canvas>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default FunctionGraph;
