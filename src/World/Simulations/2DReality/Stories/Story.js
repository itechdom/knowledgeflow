import React from "react";
import FunctionGraph from "../Simulations/FunctionGraph";
import Matter from "matter-js";
const Story = ({
  boundry,
  funcs,
  player,
  onUpdateBounds,
  engine,
  render,
  Render,
  direction,
  x,
  y,
}) => {
  const [currentZoom, setCurrentZoom] = React.useState(0);
  const [bounds, setBounds] = React.useState();
  React.useEffect(() => {
    if (!player || !engine) {
      return;
    }
    const magnitude = 0.09;
    if (direction === "left") {
      return Matter.Body.applyForce(
        player,
        { x: player.position.x, y: player.position.y },
        { x: -magnitude, y: 0 }
      );
    } else if (direction === "right") {
      return Matter.Body.applyForce(
        player,
        { x: player.position.x, y: player.position.y },
        { x: magnitude, y: 0 }
      );
    } else if (direction === "up") {
      setBounds({ ...render.bounds });
      return Matter.Body.applyForce(
        player,
        { x: player.position.x, y: player.position.y },
        { x: 0, y: -magnitude * 2 }
      );
    } else if (direction === "down") {
      setBounds({ ...render.bounds });
      return Matter.Body.applyForce(
        player,
        { x: player.position.x, y: player.position.y },
        { x: 0, y: magnitude * 2 }
      );
    }
  }, [direction, x, y]);
  React.useEffect(() => {
    onUpdateBounds();
  }, [bounds]);
  if (!player || !engine) {
    return <></>;
  }
  return (
    <>
      <FunctionGraph
        funcs={funcs}
        player={player}
        boundry={boundry}
        onUpdateBounds={onUpdateBounds}
        engine={engine}
        render={render}
        Render={Render}
        bounds={bounds}
        direction={direction}
        x={x}
        y={y}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
};
export default Story;
