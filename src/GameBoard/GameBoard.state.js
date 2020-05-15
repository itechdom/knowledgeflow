import React from "react";
import { getRandomInt } from "./utils";
const assetLocation =
  "http://knowledgeflow.markab.io.s3-website-us-east-1.amazonaws.com/";
const tiles = [
  "Grass",
  "Lava",
  "Magic",
  "Sand",
  "Snow",
];
export const GameState = ({ children, knowledge, ...rest }) => {
  const [grid, setGrid] = React.useState([]);
  const [phase, setPhase] = React.useState(0);
  const [currentTile, setCurrentTile] = React.useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = React.useState(0);
  const [mode, setMode] = React.useState("free");
  const selectSurrondingGrids = (i, j) => {
    //show nearby tiles that the user can move to
    let adj1 = grid[i] && grid[i][j] && grid[i][j];
    if (adj1) {
      grid[i][j] = {
        ...adj1,
        guide: !adj1.guide,
      };
    }
    setGrid([...grid]);
  };
  const selectGrid = (i, j, count) => {
    //you can move to this tile because it has a guide on it
    //TODO: move this as a side effect
    let isOddRow = i % 2 !== 0 ? true : false;
    if (grid[i][j].guide) {
      console.log("MODE", mode);
      //move player to that grid
      let playerTile = grid[currentTile.i][currentTile.j];
      let toTile = grid[i][j];
      let playerTileCount = playerTile.count - count;
      let toTileCount = toTile.count + count;
      if (toTileCount > playerTile.count) {
        toTileCount = playerTile.count;
      }
      grid[currentTile.i][currentTile.j] = {
        ...toTile,
        environment:
          playerTile.environment.length === 0 ? [] : playerTile.environment,
        tile: playerTile.tile,
        count: playerTileCount <= 0 ? 0 : playerTileCount,
        type: "character",
        characters: playerTileCount <= 0 ? [] : playerTile.characters,
        player: playerTile.player,
        selected: true,
      };
      grid[i][j] = {
        ...playerTile,
        environment: toTile.environment.length === 0 ? [] : toTile.environment,
        tile: toTile.tile,
        count: toTileCount <= 0 ? 0 : toTileCount,
        type: "character",
        characters: toTileCount <= 0 ? [] : playerTile.characters,
        player: playerTile.player,
        selected: true,
      };
      setMode("free");
      setCurrentTile({ ...grid[i][j], i, j });
      return unSelectAll([...grid]);
    }
    //you want to move a character
    if (phase === 0) {
      if (grid[i][j].type === "character") {
        if (grid[i][j].player === currentPlayer) {
          if (mode === "guide") {
            setMode("free");
            return unSelectAll([...grid]);
          }
          setMode("guide");
          if (isOddRow) {
            selectSurrondingGrids(i, j + 1);
            selectSurrondingGrids(i, j - 1);
            selectSurrondingGrids(i + 1, j);
            selectSurrondingGrids(i + 1, j + 1);
            selectSurrondingGrids(i - 1, j);
            selectSurrondingGrids(i - 1, j + 1);
          } else {
            selectSurrondingGrids(i, j - 1);
            selectSurrondingGrids(i, j + 1);
            selectSurrondingGrids(i - 1, j - 1);
            selectSurrondingGrids(i - 1, j);
            selectSurrondingGrids(i + 1, j - 1);
            selectSurrondingGrids(i + 1, j);
          }
        }
      }
      return setCurrentTile({ ...grid[i][j], i, j });
    }
    unSelectAll([...grid]);
    return setCurrentTile({ ...grid[i][j], i, j });
  };
  const updateGrid = (position1, position2, data) => {
    setGrid(
      grid.map((g, i) =>
        i === position1 ? g.map((gr, j) => (j === position2 ? data : gr)) : g
      )
    );
  };
  const unSelectAll = (grid) => {
    const newGrid = grid.map((g, i) => {
      return g.map((gr, j) => {
        return {
          ...gr,
          guide: false,
        };
      });
    });
    setGrid([...newGrid]);
    return newGrid;
  };
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
      updateGrid: updateGrid,
      unSelectAll: unSelectAll,
      selectGrid: selectGrid,
      RollADice: RollADice,
      phase,
      currentPlayer,
      ...rest,
    });
  });
  return <>{childrenWithProps}</>;
};
