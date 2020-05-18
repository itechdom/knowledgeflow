import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
const NumberTimeline = ({ initMatter, x, y, ...rest }) => {
  console.log(rest, "Position");
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
      100,
      1,
      10,
      0,
      (x, y, column, row, lastBody, i) => {
        //restitution is the ratio of end velocity to beginning velocity
        let circle1 = Matter.Bodies.circle(x, y, 25, {
          restitution: 0,
          isStatic: true,
          mass: 0,
        });
        circle1.number = i;
        // let chain = Matter.Composites.chain(stack, 0.5, 0, -0.5, 0);

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
          })
        );
    });
    Matter.Events.on(engine, "afterUpdate", () => {
      stack.bodies.map((bod) => {
        if (bod.number) {
          let { x, y } = bod.position;
          render.context.fillStyle = "#FFF";
          render.context.fillText(`${bod.number}`, x + 5, y);
        }
      });
    });
    let circles = [stack];
    let c = Matter.Bodies.circle(400, 100, 50);
    Matter.World.add(engine.world, [...circles, c]);
    setMyEngine(engine);
  };
  React.useEffect(() => {
    init({ wireframes: false, background: "#FFF", showAngleIndicator: false });
  }, []);
  React.useEffect(() => {});
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
