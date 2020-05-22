import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
import { zoom } from "./Camera";
import Render from "../Matter/Render";
const Axes = ({
  initMatter,
  x,
  y,
  direction,
  showX,
  showY,
  width,
  height,
  ...rest
}) => {
  const [myEngine, setMyEngine] = React.useState();
  const [player, setPlayer] = React.useState();
  const [iter, setIter] = React.useState(0);
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
        zIndex: 100,
        sprite: {
          // texture: "./assets/game/Tiles/alienBeige.png",
        },
        text: {
          content: "Test",
          size: 16,
          color: "#FFF",
          family: "Ariel",
        },
      },
    });
    player.isPlayer = true;
    let stack = Matter.Composites.stack(
      5,
      5,
      10,
      10,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        //restitution is the ratio of end velocity to beginning velocity
        let circle1 = Matter.Bodies.rectangle(x, y, 90, 90, {
          restitution: 0,
          isStatic: true,
          isSensor: true,
          angle: 0,
          mass: 0,
          render: {
            fillStyle: "red",
            sprite: {
              // texture: "assets/game/Tiles/tileGrass.png",
            },
            zindex: -1,
          },
        });
        return circle1;
      }
    );
    let xAxis = Matter.Bodies.rectangle(0, 100 * 5, 2000, 5, {
      isStatic: true,
      render: {
        zIndex: 2000,
        fillStyle: "black",
      },
    });
    let yAxis = Matter.Bodies.rectangle(100 * 5, 0, 5, 2000, {
      isStatic: true,
      render: {
        zIndex: 2000,
        fillStyle: "black",
      },
    });
    let point = Matter.Bodies.circle(5, 5, 5, {
      isStatic: true,
      render: {
        zIndex: 2000,
        fillStyle: "black",
      },
    });
    const rect = Matter.Bodies.rectangle({
      isStatic: true,
      isSensor: true,
    });
    Matter.World.add(engine.world, [player, stack, xAxis, yAxis, point, rect]);
    Matter.Events.on(engine, "beforeUpdate", () => {});
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
      //zoomOut
      zoom(Render, myEngine.render, -iter * 100, iter * 100 + 1000);
      setIter(iter + 1);
      const render = myEngine.render;
      const x = render.bounds.min.x;
      const y = render.bounds.min.y;
      const width = render.bounds.max.x;
      const height = render.bounds.max.y;
      const rows = width / 10;
      const columns = height / 10;
      let stack = Matter.Composites.stack(
        x + 5,
        y + 5,
        columns,
        rows,
        10,
        10,
        (x, y, column, row, lastBody, i) => {
          //restitution is the ratio of end velocity to beginning velocity
          let circle1 = Matter.Bodies.rectangle(x, y, 90, 90, {
            restitution: 0,
            isStatic: true,
            isSensor: true,
            angle: 0,
            mass: 0,
            render: {
              fillStyle: "red",
              sprite: {
                // texture: "assets/game/Tiles/tileGrass.png",
              },
              zindex: -1,
            },
          });
          return circle1;
        }
      );
      Matter.World.add(myEngine.world, stack);
      return Matter.Body.applyForce(
        player,
        { x, y },
        { x: 0, y: -magnitude * 2 }
      );
    } else if (direction === "down") {
      zoom(Render, myEngine.render, iter * 100, 1000 - 100);
      return Matter.Body.applyForce(
        player,
        { x, y },
        { x: 0, y: magnitude * 2 }
      );
    }
  }, [direction, x]);
  React.useEffect(() => {
    init({
      wireframes: true,
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
export default Axes;
