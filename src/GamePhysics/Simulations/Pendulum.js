import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";

const Pendulum = ({ engine, x, y, direction, initMatter }) => {
  const [myEngine, setMyEngine] = React.useState();
  React.useEffect(() => {
    const { engine } = initMatter("pendulum", "pendulum-container");
    const { Composite, Bodies, Constraint, World } = Matter;
    let newtonsCradle = Composite.create({ label: "Newtons Cradle" });
    let circle = Bodies.circle(100, 400, 50, {
      inertia: Infinity,
      restitution: 1,
      friction: 0,
      frictionAir: 0.0001,
      slop: 1,
    });
    let constraint = Constraint.create({
      pointA: { x: 300, y: 100 },
      bodyB: circle,
    });
    Composite.addBody(newtonsCradle, circle);
    Composite.addConstraint(newtonsCradle, constraint);
    World.add(engine.world, [newtonsCradle]);
    setMyEngine(engine);
  }, []);
  React.useEffect(() => {
    if (myEngine) {
    }
  }, [x, y, direction]);
  return (
    <Grid id="pendulum-container" item>
      <canvas id="pendulum"></canvas>
    </Grid>
  );
};
export default Pendulum;
