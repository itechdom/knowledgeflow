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
    //restitution is the ratio of end velocity to beginning velocity
    let circle1 = Matter.Bodies.circle(200, 200, 50, {
      restitution: 1,
    });
    circle1.restitution = 1;
    circle1.number = currentNumber;
    let stack = Matter.Composites.stack(200, 200, 1, 1, 0, 0, () => {
      return circle1;
    });
    let circles = [circle1, stack];
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
