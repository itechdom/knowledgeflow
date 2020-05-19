import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
const NumberTimeline = ({ initMatter, x, y, direction, ...rest }) => {
  const [myEngine, setMyEngine] = React.useState();
  const [player, setPlayer] = React.useState();
  const init = (options) => {
    const { engine, mouse, render } = initMatter(
      "numbers",
      "numbers-container",
      options
    );
    let player = Matter.Bodies.circle(400, 100, 50);
    let stack = Matter.Composites.stack(
      -45,
      250,
      15,
      1,
      20,
      0,
      (x, y, column, row, lastBody, i) => {
        //restitution is the ratio of end velocity to beginning velocity
        let circle1 = Matter.Bodies.circle(x, y, 25, {
          restitution: 0,
          isStatic: true,
          mass: 0,
        });
        circle1.number = i;
        return circle1;
      }
    );
    stack.bodies.map((bod, i) => {
      stack.bodies[i - 1] &&
        Matter.Composite.add(
          stack,
          Matter.Constraint.create({
            bodyA: bod,
            bodyB: stack.bodies[i - 1],
            stiffness: 0,
            render: {
              strokeStyle: "#000",
            },
          })
        );
    });
    Matter.Events.on(engine, "beforeupdate", function () {
      var x = player.position.x * -1;
      var y = player.position.y * -1;
      Matter.Render.lookAt(render, {
        min: { y: y - FoV / 2, x: x - FoV / 2 },
        max: { y: y + FoV / 2, x: x + FoV / 2 },
      });
    });
    Matter.Events.on(engine, "afterUpdate", () => {
      stack.bodies.map((bod) => {
        if (bod.number) {
          let { x, y } = bod.position;
          render.context.fontSize = "20px";
          render.context.fillStyle = "#FFF";
          render.context.fillText(`${bod.number - 5}`, x, y);
        }
      });
    });
    Matter.World.add(engine.world, [stack, player]);
    setPlayer(player);
    setMyEngine(engine);
  };
  React.useEffect(() => {
    if (!player) {
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
  }, [direction, player, x]);
  React.useEffect(() => {
    init({ wireframes: true, background: "#FFF", showAngleIndicator: false });
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
export default NumberTimeline;
