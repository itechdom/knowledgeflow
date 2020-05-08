import React from "react";
import Matter from "matter-js";
function gravity(bodyA, bodyB) {
  // use Newton's law of gravitation
  var bToA = Matter.Vector.sub(bodyB.position, bodyA.position),
    distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001,
    normal = Matter.Vector.normalise(bToA),
    magnitude = -1 * ((bodyA.mass * bodyB.mass) / distanceSq),
    force = Matter.Vector.mult(normal, magnitude);

  // to apply forces to both bodies
  Matter.Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
  Matter.Body.applyForce(bodyB, bodyB.position, force);
}
const Pendulum = ({ engine, x, y, direction, initMatter, onUpdate }) => {
  const [myEngine, setMyEngine] = React.useState();
  React.useEffect(() => {
    const { engine } = initMatter("gravitation");
    engine.world.gravity.y = 0;
    let circle1 = Matter.Bodies.circle(100, 100, 100);
    let circle2 = Matter.Bodies.circle(200, 200, 50);
    let circle3 = Matter.Bodies.circle(200, 200, 25);
    let circle4 = Matter.Bodies.circle(200, 200, 12.5);
    let circles = [circle1, circle2, circle3, circle4];
    let [bodyA, ...rest] = circles;
    Matter.Events.on(engine, "beforeUpdate", () => {
      rest.map((r) => gravity(bodyA, r));
    });
    Matter.World.add(engine.world, circles);
    setMyEngine(engine);
  }, []);
  return <canvas id="gravitation"></canvas>;
};
export default Pendulum;
