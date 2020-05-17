import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
import { getRandomInt } from "../../GameBoard/utils";
const Primes = ({ initMatter }) => {
  const [myEngine, setMyEngine] = React.useState();
  const init = (options) => {
    const { engine, mouse } = initMatter("primes", "primes-container", options);
    console.log("Mouse", mouse);
    //restitution is the ratio of end velocity to beginning velocity
    let circle1 = Matter.Bodies.circle(100, 100, 100, {
      restitution: 1,
    });
    circle1.restitution = 0;
    let circles = [circle1];
    const number = getRandomInt(0, 100);
    console.log(number, "hello");
    Matter.Events.on(engine, "beforeUpdate", () => {});
    Matter.World.add(engine.world, circles);
    setMyEngine(engine);
  };
  const primes = [
    2,
    3,
    5,
    7,
    11,
    13,
    17,
    19,
    23,
    29,
    31,
    37,
    41,
    43,
    47,
    53,
    59,
    61,
    67,
    71,
    73,
    79,
    83,
    89,
    97,
    101,
    103,
    107,
    109,
    113,
    127,
    131,
    137,
    139,
    149,
    151,
    157,
    163,
    167,
    173,
    179,
    181,
    191,
    193,
    197,
    199,
  ];
  React.useEffect(() => {
    init();
  }, []);
  return (
    <Grid item style={{ marginTop: "10px" }}>
      <Grid
        alignItems="center"
        justify="center"
        container
        id="primes-container"
      >
        <Grid xs={12} item>
          <canvas id="primes"></canvas>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Primes;
