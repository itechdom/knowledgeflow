import React from "react";
import { getRandomInt } from "./utils";
const assetLocation =
  "http://knowledgeflow.markab.io.s3-website-us-east-1.amazonaws.com/";
const tiles = [
  "Grass",
  "Lava",
  "Magic",
  // "Dirt",
  // "Sand",
  // "Snow",
  // "Stone",
  // "Water",
];
export const GameState = ({ children, knowledge }) => {
  const [grid, setGrid] = React.useState([]);
  const [phase, setPhase] = React.useState();
  const getRandomCharacter = () => {
    const options = ["Beige", "Blue", "Green", "Pink", "Yellow"];
    const randomCharacter = options[getRandomInt(0, options.length - 1)];
    return `${assetLocation}game/hexagonTiles/Tiles/alien${randomCharacter}.png`;
  };
  const getATile = (tile) => {
    let suffix = "";
    if (tile === "Water") {
      suffix = "_shadow";
    }
    return `${assetLocation}game/hexagonTiles/Tiles/tile${tile}${suffix}.png`;
  };
  const getTile = (tile, selected) => {
    const suffix = "_full";
    if (tile) {
      if (selected) {
        return `${tile.url.replace(suffix, "")}`;
      }
      if (tile.url.indexOf(suffix) === -1) {
        return `${tile.url.replace(".png", "")}${suffix}.png`;
      }
      return tile.url;
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
      url: getATile("Water"),
      selected: true,
      type: "background",
      environment: [getBackgroundEnvironment()],
    };
    return tile;
  };
  const initGrid = () => {
    for (let i = 0; i < 9; i++) {
      if (!grid[i]) grid[i] = [];
      for (let j = 0; j < 10; j++) {
        grid[i][j] = {
          name: `${i}x${j}`,
          url: getTile(),
          environment: [getRandomTree()],
          display: getRandomInt(1, 2) === 2 ? true : false,
          selected: false,
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
            name: `${i}x${j}`,
            url: getTile(),
            environment: [getRandomCharacter()],
            type: "character",
            selected: true,
          };
        }
      });
    });

    ///ADDING WATER TILES
    //add water tiles to the beginning and end of each row
    // grid.map((g, i) => {
    //   for (let a = 0; a < 9; a++) {
    //     g.unshift(getBackgroundTile());
    //     g.push(getBackgroundTile());
    //   }
    // });
    // for (let b = 0; b < 3; b++) {
    //   let initialLength = grid.length;
    //   for (let a = 0; a < 28; a++) {
    //     if (!grid[initialLength]) {
    //       grid[initialLength] = [];
    //     }
    //     grid[initialLength].push(getBackgroundTile());
    //   }
    // }
    //generate random scene object
    setGrid(grid);
  };
  const updateAllGrids = (data) => {
    setGrid([...data]);
  };
  const selectGrid = (i, j) => {
    if (grid[i][j].name === "Water") {
      return unSelectAll(grid);
    }
    return updateGrid(i, j, {
      ...grid[i][j],
      url: getTile(grid[i][j], !grid[i][j].selected),
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
        if (gr.name !== "Water" && gr.type !== "character") {
          return { ...gr, selected: false, url: getTile(grid[i][j], false) };
        }
        return { ...gr };
      });
    });
    setGrid([...newGrid]);
  };
  const RollADice = () => {
    let roll = getRandomInt(1, 6);
    return roll;
  };
  React.useEffect(() => {
    initGrid();
    setPhase("0-a");
  }, []);
  console.log("rerender");
  //knowledgeflow.markab.io
  const childrenWithProps = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      grid: grid,
      updateGrid: updateGrid,
      updateAllGrids: updateAllGrids,
      unSelectAll: unSelectAll,
      selectGrid: selectGrid,
      RollADice: RollADice,
    });
  });
  return <>{childrenWithProps}</>;
};
