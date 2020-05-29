//prerequesit or begin
//knot
//end resources
//so we have cards and texts that have to be shown as the user moves around the scene
import React from "react";
const Story = ({
  boundry,
  fns,
  player,
  onUpdateBounds,
  engine,
  render,
  Render,
}) => {
  //advanced a story when fn[0] is met
  return (
    <FunctionGraph
      fns={fns}
      player={player}
      boundry={boundry}
      onUpdateBounds={onUpdateBounds}
      engine={engine}
      render={render}
      Render={Render}
    />
  );
};
export default Story;
