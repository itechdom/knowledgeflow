import React from "react";
import Story from "./Story";
import Matter from "matter-js";
//https://en.wikipedia.org/wiki/Sine_wave
let phases = [];
const Waves = () => {
  const [currentPhase, setCurrentPhase] = React.useState(0);
  let player = Matter.Bodies.circle(400, 100, 50, {
    restitution: 0.9,
    render: {
      zIndex: 9000,
    },
  });
  return (
    <Story
      currentPhase={currentPhase}
      storyCondition={() => {
        if (phases[0]()) {
          setCurrentPhase(currentPhase + 1);
        }
      }}
      fns={[(x) => Math.sin(x)]}
      boundry={[0, 100]}
      player={player}
    ></Story>
  );
};
