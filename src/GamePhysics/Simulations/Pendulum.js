import Matter from "matter-js";
import React from "react";

const Pendulum = ({ engine, x, y, direction }) => {
  React.useEffect(() => {
    engine &&
      Matter.World.add(engine.world, [
        Matter.Bodies.rectangle(200, 200, 75, 95, {
          render: {
            sprite: {
              texture: "./assets/game/Tiles/tileMagic_full.png",
            },
          },
        }),
      ]);
  }, [engine]);
  React.useEffect(() => {
    if (engine) {
      if (direction === "right") {
        engine.world.bodies[4].position.x += 2;
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
