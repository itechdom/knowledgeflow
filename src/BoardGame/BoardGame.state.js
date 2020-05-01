import React from "react";
import { getRandomInt } from "./utils";
const assetLocation =
  "http://knowledgeflow.markab.io.s3-website-us-east-1.amazonaws.com/";
const tiles = [
  "Grass",
  "Lava",
  "Magic",
  // "Dirt",
  "Sand",
  "Snow",
  // "Stone",
  // "Water",
];
export const GameState = ({ children, knowledge }) => {
  const [grid, setGrid] = React.useState([]);
  const [phase, setPhase] = React.useState(0);
  const [currentTile, setCurrentTile] = React.useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = React.useState(0);
  const getRandomCharacter = () => {
    const options = ["Beige", "Blue", "Green", "Pink", "Yellow"];
    const randomCharacter = options[getRandomInt(0, options.length - 1)];
    return `${assetLocation}game/hexagonTiles/Tiles/alien${randomCharacter}.png`;
  };
  const getCurrentPlayer = () => {
    let pos1, pos2;
    let final = grid
      .map((g, i) => {
        let players = g.filter((gr, j) => {
          if (gr.type === "character" && gr.player === currentPlayer) {
            pos1 = i;
            pos2 = j;
            return true;
          }
          return false;
        });
        return players;
      })
      .filter((g) => g.length > 0);
    return { ...final[0][0], i: pos1, j: pos2 };
  };
  const getATile = (tile) => {
    let suffix = "_full";
    if (tile === "Water") {
      suffix = "_shadow";
    }
    return `${assetLocation}game/hexagonTiles/Tiles/tile${tile}${suffix}.png`;
  };
  const getTile = (tile, selected) => {
    const suffix = "";
    if (tile) {
      if (selected) {
        return `${tile.tile.replace(suffix, "")}`;
      }
      if (tile.tile.indexOf(suffix) === -1) {
        return `${tile.tile.replace(".png", "")}${suffix}.png`;
      }
      return tile.tile;
    }
    return `${assetLocation}game/hexagonTiles/Tiles/tile${
      tiles[getRandomInt(0, tiles.length - 1)]
    }${suffix}.png`;
  };
  const getRandomTree = (season) => {
    const trees = ["Blue", "Green"];
    const suffix = "_low";
    const randomTree = `${assetLocation}game/hexagonTiles/Tiles/tree${
      trees[getRandomInt(0, trees.length - 1)]
    }${suffix}.png`;
    return randomTree;
  };
  const getRandomRock = (season) => {
    const randomTree = `${assetLocation}game/hexagonTiles/Tiles/smallRockGrass.png`;
    console.log(randomTree);
    return randomTree;
  };
  const getBackgroundEnvironment = () => {
    return getRandomInt(0, 1) < 1
      ? `${assetLocation}game/hexagonTiles/Tiles/waveWater.png`
      : ``;
  };
  const getBackgroundTile = () => {
    const tile = {
      name: `Water`,
      tile: getATile("Water"),
      selected: true,
      type: "background",
      environment: [getBackgroundEnvironment()],
    };
    return tile;
  };

  //this is just a fun test, using conway's game of life
  const simulate = () => {};

  const initGrid = () => {
    for (let i = 0; i < 9; i++) {
      if (!grid[i]) grid[i] = [];
      for (let j = 0; j < 10; j++) {
        grid[i][j] = {
          // name: `${i}x${j}`,
          tile: getTile(),
          environment: getRandomInt(1, 2) === 2 ? [getRandomTree()] : [],
          selected: false,
          count: 0,
        };
      }
    }

    //ADDING RANDOM CHRACTERS
    grid.map((g, i) => {
      g.map((gr, j) => {
        if (
          (i === 0 && j === 0) ||
          (i === grid.length - 1 && j === g.length - 1)
        ) {
          grid[i][j] = {
            name: `x90`,
            tile: getTile(),
            player: i === 0 ? 0 : 1,
            environment: [],
            characters: [getRandomCharacter()],
            moved: false,
            count: 90,
            type: "character",
            selected: true,
          };
        }
      });
    });
    setGrid(grid);
  };
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
    let player = getCurrentPlayer();
    setCurrentTile([i, j]);
    let isOddRow = i % 2 !== 0 ? true : false;
    if (grid[i][j].guide) {
      //move player to that grid
      let playerTile = grid[player.i][player.j];
      let toTile = grid[i][j];
      let playerTileCount = playerTile.count - count;
      let toTileCount = toTile.count + count;
      if (toTileCount > 90) {
        console.log("90");
        toTileCount = playerTile.count;
      }
      grid[player.i][player.j] = {
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
      return unSelectAll([...grid]);
    }
    if (grid[i][j].name === "Water") {
      return unSelectAll(grid);
    }
    //you want to move a character
    if (phase === 0) {
      if (grid[i][j].type === "character") {
        if (grid[i][j].player === currentPlayer) {
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
        return;
      }
    }
    return updateGrid(i, j, {
      ...grid[i][j],
      tile: getTile(grid[i][j], !grid[i][j].selected),
      selected: !grid[i][j].selected,
    });
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
    initGrid();
    setPhase(0);
    setCurrentPlayer(0);
  }, []);
  console.log("rerender");
  //knowledgeflow.markab.io
  const childrenWithProps = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      grid: grid,
      updateGrid: updateGrid,
      unSelectAll: unSelectAll,
      selectGrid: selectGrid,
      RollADice: RollADice,
      phase,
      currentPlayer,
    });
  });
  return <>{childrenWithProps}</>;
};
