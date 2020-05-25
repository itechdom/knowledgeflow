import React from "react";
import { getRandomInt } from "./utils";
export const GameState = ({ children, knowledge, ...rest }) => {
  const [phase, setPhase] = React.useState(0);
  const [currentPlayer, setCurrentPlayer] = React.useState(0);
  const [mode, setMode] = React.useState("free");
  const RollADice = () => {
    let roll = getRandomInt(1, 6);
    return roll;
  };
  const endTurn = () => {
    const nextPhase = phase + 1;
    //move
    if (phase === 0) {
    }
    //attack
    else if (phase === 1) {
    }
    //rienforce
    else if (phase === 2) {
      setCurrentPlayer(currentPlayer === 1 ? 0 : 1);
      setPhase(0);
      return;
    }
    return setPhase(nextPhase);
  };
  React.useEffect(() => {
    setPhase(0);
    setCurrentPlayer(0);
  }, []);
  console.log("rerender");
  //knowledgeflow.markab.io
  const childrenWithProps = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      RollADice: RollADice,
      phase,
      currentPlayer,
      ...rest,
    });
  });
  return <>{childrenWithProps}</>;
};
