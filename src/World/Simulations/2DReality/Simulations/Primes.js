import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
import { getRandomInt } from "../../GameBoard/utils";
function primeFactors(n) {
  var factors = [],
    divisor = 2;

  while (n > 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}
const Primes = ({ initMatter }) => {
  const [myEngine, setMyEngine] = React.useState();
  let currentNumber = false ? 10000 : getRandomInt(1, 1000000);
  let iterations = 0;
  let factors = [];
  const spawnCircle = (myEngine, body, factors) => {
    if (iterations === factors.length) {
      return;
    }
    iterations = factors.length;
    let { x, y } = body.position;
    factors.map((factor) => {
      let circle = Matter.Bodies.circle(x, y, 50, {
        restitution: 0.1,
      });
      circle.number = factor;
      Matter.World.add(myEngine.world, circle);
      Matter.Body.applyForce(circle, { x, y }, { x: 1, y: 1 });
    });
  };
  const init = (options) => {
    const { engine, mouse, render } = initMatter(
      "primes",
      "primes-container",
      options
    );
    //restitution is the ratio of end velocity to beginning velocity
    let circle1 = Matter.Bodies.circle(200, 200, 50, {
      restitution: 1,
    });
    circle1.restitution = 1;
    circle1.number = currentNumber;
    let circles = [circle1];
    Matter.Events.on(engine, "afterUpdate", () => {
      let { x, y } = engine.world.bodies[4].position;
      factors.length > 0 &&
        factors.map((factor, i) => {
          let { x, y } = engine.world.bodies[4 + i + 1].position;
          render.context.fillStyle = "#FFF";
          render.context.fillText(`${factor}`, x, y);
        });
      render.context.fillStyle = "#FFF";
      render.context.fillText(`${currentNumber}`, x, y);
    });
    Matter.Events.on(engine, "collisionEnd", (event) => {
      let fc = primeFactors(currentNumber);
      if (fc[0]) {
        factors = fc;
        spawnCircle(engine, engine.world.bodies[4], factors);
      }
    });
    Matter.World.add(engine.world, circles);
    setMyEngine(engine);
  };
  React.useEffect(() => {
    init({ wireframes: false, background: "#FFF", showAngleIndicator: false });
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
