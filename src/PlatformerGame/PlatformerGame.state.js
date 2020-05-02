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
  const [currentPlayer, setCurrentPlayer] = React.useState(0);
  const onKeyPress = (key) => {
    switch (key) {
      case "w":
        this.isInverted()
          ? (this.camera.position.z -= 0.1)
          : (this.camera.position.z += 0.1);
        break;
      case "s":
        this.isInverted()
          ? (this.camera.position.z += 0.1)
          : (this.camera.position.z -= 0.1);
        break;
      case "a":
        this.camera.rotation.y += 0.1;
        break;
      case "d":
        this.camera.rotation.y += -1 * 0.1;
        break;
      case "e":
        this.camera.position.x += this.isInverted() ? 1 * 0.1 : -1 * 0.1;
        // this.grid.rotation.y = this.grid.rotation.y + 1;
        // this.grid.rotation.z = this.grid.rotation.z + 1;
        break;
      case "q":
        this.camera.position.x += this.isInverted() ? -1 * 0.1 : 1 * 0.1;
        break;
      case "c":
        this.camera.position.y += 0.1;
        break;
      case "z":
        this.camera.position.y += -1 * 0.1;
        break;
      case "x":
        this.camera.rotation.z += 0.1;
        break;
      case "v":
        this.camera.rotation.z += -1 * 0.1;
        break;
      case "space":
        this.setState({ jumping: true });
        break;
    }
  };
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
    return setGrid(grid);
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
      onKeyPress,
      phase,
      currentPlayer,
    });
  });
  return <>{childrenWithProps}</>;
};
