import Matter from "matter-js";
import React from "react";

const Pendulum = ({ engine, x, y, direction }) => {
  React.useEffect(() => {
    if (!engine) {
      return;
    }
    const { Composite, Bodies, Constraint, World } = Matter;
    var newtonsCradle = Composite.create({ label: "Newtons Cradle" });
    var separation = 1.9,
      circle = Bodies.circle(100, 400, 50, {
        inertia: Infinity,
        restitution: 1,
        friction: 0,
        frictionAir: 0.0001,
        slop: 1,
      }),
      constraint = Constraint.create({
        pointA: { x: 300, y: 100 },
        bodyB: circle,
      });
    Composite.addBody(newtonsCradle, circle);
    Composite.addConstraint(newtonsCradle, constraint);
    World.add(engine.world, [newtonsCradle]);
  }, [engine]);
  React.useEffect(() => {
    if (engine) {
      if (direction === "right") {
        engine.world.bodies[4].position.x += 2;
        // Matter.Body.scale(engine.world.bodies[4], 1.1, 1.1);
        engine.world.bodies.map((b, i) => {
          i !== 5 && Matter.Body.scale(b, 1.1, 1.1);
        });
        console.log(engine.world.bodies);
        // engine.world.bodies[4].position.y -= Math.sin(Math.pi / x);
      }
      if (direction === "left") {
        engine.world.bodies[4].position.x -= 2;
      }
      if (direction === "up") {
        engine.world.bodies[4].position.y -= 5;
      }
      // if (direction === "down") {
      //   engine.world.bodies[4].position.y += 2;
      // }
      console.log(engine.world);
      Matter.Engine.update(engine);
    }
  }, [x, y, direction]);
  return <p></p>;
};
export default Pendulum;
