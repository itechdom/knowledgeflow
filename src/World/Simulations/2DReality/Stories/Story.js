//prerequesit or begin
//knot
//end resources
//so we have cards and texts that have to be shown as the user moves around the scene
import React from "react";
const Story = ({
  initMatter,
  boundry,
  fns,
  player,
  onUpdateBounds,
  engine,
  render,
}) => {
  //advanced a story when fn[0] is met
  return (
    <FunctionGraph
      initMatter={initMatter}
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
