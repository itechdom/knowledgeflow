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
    console.log(
      ((player.position.x - 500) / 100).toFixed(2),
      ((player.position.y - 500) / 100).toFixed(2)
    );
    console.log(engine.world.bodies);
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
      if (currentZoom < 3) {
        setCurrentZoom(currentZoom + 1);
        // setBackground(currentZoom + 1);
        setBounds({ ...render.bounds });
      }
      // let newGrid = onGridResize({ engine });
      // Matter.World.add(engine.world, newGrid);
      return Matter.Body.applyForce(
        player,
        { x: player.position.x, y: player.position.y },
        { x: 0, y: -magnitude * 2 }
      );
    } else if (direction === "down") {
      if (currentZoom > 0) {
        setCurrentZoom(currentZoom - 1);
        // setBackground(currentZoom - 1);
        setBounds({ ...render.bounds });
      }
      return Matter.Body.applyForce(
        player,
        { x: player.position.x, y: player.position.y },
        { x: 0, y: magnitude * 2 }
      );
    }
  }, [direction, x, y]);
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
      />
    </>
  );
};
export default Story;
