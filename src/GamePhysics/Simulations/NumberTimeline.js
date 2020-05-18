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
    let stack = Matter.Composites.stack(400, 250, 5, 1, 10, 0, () => {
      //restitution is the ratio of end velocity to beginning velocity
      let circle1 = Matter.Bodies.circle(400, 250, 10, {
        restitution: 0,
        mass: 0,
      });
      return circle1;
    });
    // let chain = Matter.Composites.chain(stack, 0.5, 0, -0.5, 0);
    stack.bodies.map((bod, i) => {
      Matter.Composite.add(
        stack,
        Matter.Constraint.create({
          bodyA: bod,
          pointB: { x: 0, y: 260 },
          stiffness: 0,
        })
      );
      Matter.Composite.add(
        stack,
        Matter.Constraint.create({
          bodyA: bod,
          pointB: { x: 800, y: 260 },
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
