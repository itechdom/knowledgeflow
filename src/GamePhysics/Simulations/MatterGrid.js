import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
const MatterGrid = ({ initMatter, x, y, direction, ...rest }) => {
  const [myEngine, setMyEngine] = React.useState();
  const [player, setPlayer] = React.useState();
  const zoomOut = (Render, render) => {
    let count = 0;
    setInterval(() => {
      count += 10;
      Render.lookAt(render, {
        min: { x: count / 3, y: count / 3 },
        max: { x: count, y: count },
      });
    }, 100);
  };
  const zoomIn = (Render, render) => {
    let count = 0;
    setInterval(() => {
      count -= 10;
      Render.lookAt(render, {
        min: { x: count / 3, y: count / 3 },
        max: { x: count, y: count },
      });
    }, 100);
  };
  const moveCameraRight = (Render, render) => {
    let count = 0;
    setInterval(() => {
      count += 20;
      Render.lookAt(render, {
        min: { x: count, y: 0 },
        max: { x: 1000, y: 1000 },
      });
    }, 100);
  };
  const init = (options) => {
    const { engine, mouse, render, Render } = initMatter(
      "numbers",
      "numbers-container",
      options,
      false,
      {
        render: {
          zIndex: 100,
          fillStyle: "#8BE1EB",
          sprite: {
            texture: "./assets/game/Tiles/dirt.png",
          },
        },
      }
    );
    let player = Matter.Bodies.circle(400, 100, 50, {
      render: {
        zIndex: 100,
        sprite: {
          texture: "./assets/game/Tiles/alienBeige.png",
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
      0,
      0,
      100,
      20,
      0,
      0,
      (x, y, column, row, lastBody, i) => {
        //restitution is the ratio of end velocity to beginning velocity
        let circle1 = Matter.Bodies.rectangle(x, y, 60, 60, {
          restitution: 0,
          isStatic: true,
          isSensor: true,
          angle: 0,
          mass: 0,
          render: {
            fillStyle: "red",
            sprite: {
              texture: "./assets/game/Tiles/tileGrass.png",
            },
            zindex: -1,
          },
        });
        return circle1;
      }
    );
    // zoomOut(Render, render);
    // zoomIn(Render, render);
    // moveCameraRight(Render, render);
    Matter.World.add(engine.world, [player, stack]);
    setPlayer(player);
    setMyEngine(engine);
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
  }, [direction, x]);
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
    <Grid item style={{ marginTop: "10px" }}>
      <Grid
        alignItems="center"
        justify="center"
        container
        id="numbers-container"
      >
        <Grid xs={12} item>
          <canvas style={{ fontSize: "24px" }} id="numbers"></canvas>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MatterGrid;
