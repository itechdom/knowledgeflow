import Matter from "matter-js";
import React from "react";

const Pendulum = ({ engine, world, x, y, direction, grid, ctx }) => {
  React.useEffect(() => {
    if (world) {
      // const canvas = document.getElementById("my-canvas");
      // const ctx = canvas.getContext("2d");
      // const image = document.getElementById("tile-1");
      // image.addEventListener("load", (e) => {
      //   ctx.drawImage(image, 100, 100);
      //   Matter.World.add(world, [
      //     Matter.Bodies.rectangle(0, 0, 200, 200, {
      //       isStatic: true,
      //       sprite: {
      //         texture: "./assets/game/Tiles/tileDirt_full.png",
      //       },
      //     }),
      //   ]);
      // });
      // Matter.World.add(world, [Matter.Bodies.circle(150, 150, 10)]);
    }
  }, [world]);
  React.useEffect(() => {
    if (world && engine) {
      if (direction === "right") {
        world.bodies[0].position.x += 2;
        // world.bodies[0].position.y -= Math.sin(Math.pi / x);
      }
      if (direction === "left") {
        world.bodies[0].position.x -= 2;
      }
      if (direction === "up") {
        world.bodies[0].position.y -= 5;
      }
      if (direction === "down") {
        world.bodies[0].position.y += 2;
      }
      // Matter.Engine.update(engine);
    }
  }, [x, y, direction]);
  return <p></p>;
};
export default Pendulum;
