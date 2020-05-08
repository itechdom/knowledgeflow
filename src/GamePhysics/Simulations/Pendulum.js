import React from "react";
import Matter from "matter-js";

const Pendulum = ({ engine, x, y, direction, initMatter }) => {
  const [myEngine, setMyEngine] = React.useState();
  React.useEffect(() => {
    const { engine } = initMatter("pendulum");
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
      if (direction === "right") {
        myEngine.world.bodies[4].position.x += 2;
        // Matter.Body.scale(myEngine.world.bodies[4], 1.1, 1.1);
        myEngine.world.bodies.map((b, i) => {
          i !== 5 && Matter.Body.scale(b, 1.1, 1.1);
        });
        console.log(myEngine.world.bodies);
        // myEngine.world.bodies[4].position.y -= Math.sin(Math.pi / x);
      }
      if (direction === "left") {
        myEngine.world.bodies[4].position.x -= 2;
      }
      if (direction === "up") {
        myEngine.world.bodies[4].position.y -= 5;
      }
      // if (direction === "down") {
      //   myEngine.world.bodies[4].position.y += 2;
      // }
      console.log(myEngine.world);
      Matter.Engine.update(engine);
    }
  }, [x, y, direction]);
  return <canvas id="pendulum"></canvas>;
};
export default Pendulum;
