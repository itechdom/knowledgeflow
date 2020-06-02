import React from "react";
import Matter from "matter-js";
const Splatter = ({ engine, render, Render }) => {
  return {
    launch: (x, y, count) => {
      for (let i = 0; i < count; i++) {
        let particle = Matter.Bodies.circle(x, y, 10, {
          label: "particle",
          restitution: 0.4,
          render: {
            fillStyle: "#000000",
            zIndex: 9000,
          },
        });
        Matter.World.add(engine.world, particle);
        Matter.Body.applyForce(particle, { x: 0, y: 1 }, { x: 2, y: 0 });
        setTimeout(() => {
          Matter.World.remove(engine.world, particle);
        }, 1000);
      }
    },
  };
};
export default Splatter;
