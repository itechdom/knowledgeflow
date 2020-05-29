//prerequesit or begin
//knot
//end resources
//so we have cards and texts that have to be shown as the user moves around the scene
import React from "react";
const Story = ({ engine, boundry, fns, player, onUpdateBounds }) => {
  //advanced a story when fn[0] is met
  return (
    <FunctionGraph
      initMatter={(player) => {
        console.log("Player", player);
        return { engine: engine, render: engine.render, ...rest };
      }}
      fns={fns}
      player={player}
      boundry={boundry}
      onUpdateBounds={onUpdateBounds}
    />
  );
};
export default Story;
