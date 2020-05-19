import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
const MatterGrid = ({ initMatter, x, y, direction, ...rest }) => {
  const [myEngine, setMyEngine] = React.useState();
  const [player, setPlayer] = React.useState();
  const init = (options) => {
    const { engine, mouse, render } = initMatter(
      "numbers",
      "numbers-container",
      options,
      true
    );
    let player = Matter.Bodies.circle(400, 100, 50, {
      render: { zIndex: 100 },
    });
    player.isPlayer = true;
    let stack = Matter.Composites.stack(
      0,
      0,
      20,
      20,
      5,
      5,
      (x, y, column, row, lastBody, i) => {
        //restitution is the ratio of end velocity to beginning velocity
        let circle1 = Matter.Bodies.rectangle(x, y, 50, 50, {
          restitution: 0,
          isStatic: true,
          isSensor: true,
          mass: 0,
          render: {
            fillStyle: "lightblue",
            zIndex: -1,
          },
        });
        circle1.number = i;
        return circle1;
      }
    );
    // stack.bodies.map((bod, i) => {
    //   stack.bodies[i - 1] &&
    //     Matter.Composite.add(
    //       stack,
    //       Matter.Constraint.create({
    //         bodyA: bod,
    //         bodyB: stack.bodies[i - 1],
    //         stiffness: 0,
    //         render: {
    //           strokeStyle: "#000",
    //         },
    //       })
    //     );
    // });
    Matter.Events.on(engine, "beforeUpdate", function (d) {
      // stack.bodies.map((bod, i) => {
      //   if (bod.number) {
      //     let { x, y } = bod.position;
      //     render.context.fontSize = "20px";
      //     render.context.fillStyle = "#FFF";
      //     render.context.fillText(`${bod.number - 5}`, x, y);
      //   }
      // });
    });
    Matter.Events.on(engine, "afterUpdate", () => {});
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
