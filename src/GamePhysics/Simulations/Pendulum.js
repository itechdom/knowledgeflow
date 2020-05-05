import Matter from "matter-js";
import React from "react";
const loadImage = (url, onSuccess, onError) => {
  const img = new Image();
  img.onload = () => {
    onSuccess(img.src);
  };
  img.onerror = onError();
  img.src = url;
};
const loadTiles = (grid, world) => {
  loadImage(
    grid[0][0].tile,
    (url) => {
      Matter.World.add(world, [
        ...world.bodies,
        Matter.Bodies.rectangle(0, 0, 55, 50, {
          isStatic: true,
          sprite: {
            texture: url,
            xScale: 2,
            yScale: 2,
          },
        }),
      ]);
    },
    (err) => console.error(err)
  );
};
const Pendulum = ({ engine, world, x, y, direction, grid }) => {
  React.useEffect(() => {
    if (world) {
      loadTiles(grid, world);
      Matter.World.add(world, [Matter.Bodies.circle(150, 150, 10)]);
    }
  }, [world]);
  React.useEffect(() => {
    console.log("WORLD", world);
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
