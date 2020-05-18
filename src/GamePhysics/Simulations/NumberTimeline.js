import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
const NumberTimeline = ({ initMatter }) => {
  const [myEngine, setMyEngine] = React.useState();
  const init = (options) => {
    const { engine, mouse, render } = initMatter(
      "numbers",
      "numbers-container",
      options
    );
    let stack = Matter.Composites.stack(
      0,
      250,
      10,
      1,
      100,
      0,
      (x, y, column, row, lastBody, i) => {
        //restitution is the ratio of end velocity to beginning velocity
        let circle1 = Matter.Bodies.circle(x, y, 10, {
          restitution: 0,
          mass: 0,
        });
        // let chain = Matter.Composites.chain(stack, 0.5, 0, -0.5, 0);

        return circle1;
      }
    );
    stack.bodies.map((bod, i) => {
      Matter.Composite.add(
        stack,
        Matter.Constraint.create({
          bodyA: bod,
          bodyB: stack.bodies[i - 1] ? stack.bodies[i - 1] : null,
          pointB: stack.bodies[i - 1] ? null : 0,
          stiffness: 0,
        })
      );
    });
    let circles = [stack];
    Matter.World.add(engine.world, circles);
    setMyEngine(engine);
  };
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
          <canvas id="numbers"></canvas>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default NumberTimeline;
