import React from "react";
import { getRandomInt } from "../GameBoard/utils";
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
export const GameState = ({ children, knowledge, health }) => {
  const [grid, setGrid] = React.useState([]);
  const [currentPlayer, setCurrentPlayer] = React.useState();
  const [otherPlayer, setOtherPlayer] = React.useState();
  const [weaponLock, setWeaponLock] = React.useState();
  let timeout;
  const onKeyPress = (key) => {
    // if (key === "space") {
    //   if (weaponLock) {
    //     return;
    //   }
    //   timeout = setTimeout(() => {
    //     setWeaponLock(false);
    //   }, 1000);
    //   setWeaponLock(true);
    // }
    switch (key) {
      case "w":
        moveCharacter("up");
        break;
      case "s":
        moveCharacter("down");
        break;
      case "a":
        moveCharacter("left");
        break;
      case "d":
        moveCharacter("right");
        break;
      case "space":
        send();
        break;
    }
  };
  const getRandomCharacter = () => {
    const options = ["Beige", "Blue", "Green", "Pink", "Yellow"];
    const randomCharacter = options[getRandomInt(0, options.length - 1)];
    return `${assetLocation}game/Tiles/alien${randomCharacter}.png`;
  };
  const getTile = () => {
    const suffix = "";
    return `${assetLocation}game/Tiles/tile${
      tiles[getRandomInt(0, tiles.length - 1)]
    }${suffix}.png`;
  };

  const send = () => {
    //send a projectile towards another tile
    let { i: ci, j: cj } = currentPlayer;
    let { i: oi, j: oj } = otherPlayer;
    //shoot projectile towards that direction?
    let x = oj - cj;
    let count = 0;
    let interval = setInterval(() => {
      let fromTile = grid[ci][cj + (count - 1)];
      let toTile = grid[ci][cj + count];
      if (count > x) {
        //remove the projectile
        grid[ci][cj + (count - 1)] = {
          ...fromTile,
          messages: [],
        };
        setGrid([...grid]);
        return clearInterval(interval);
      }
      if (toTile && toTile.type === "character" && count !== 0) {
        grid[ci][cj + count] = {
          ...toTile,
          count: toTile.count - 1,
          messages: [],
        };
      } else {
        grid[ci][cj + count] = {
          ...toTile,
          messages: [{ type: "projectile" }],
        };
      }
      grid[ci][cj + (count - 1)] = {
        ...fromTile,
        messages: [],
      };
      setGrid([...grid]);
      count++;
    }, 200);
  };

  const moveCharacter = (direction) => {
    let playerTile = grid[currentPlayer.i][currentPlayer.j];
    let toTile, i, j;
    if (direction === "up") {
      i = currentPlayer.i - 1;
      j = currentPlayer.j;
    } else if (direction === "down") {
      i = currentPlayer.i + 1;
      j = currentPlayer.j;
    } else if (direction === "left") {
      i = currentPlayer.i;
      j = currentPlayer.j - 1;
    } else if (direction === "right") {
      i = currentPlayer.i;
      j = currentPlayer.j + 1;
    }
    if (grid[i] && grid[i][j]) {
      toTile = grid[i][j];
    } else {
      return;
    }
    grid[currentPlayer.i][currentPlayer.j] = {
      ...toTile,
      tile: playerTile.tile,
      player: playerTile.player,
      selected: true,
    };
    grid[i][j] = {
      ...playerTile,
      tile: toTile.tile,
      type: "character",
      characters: playerTile.characters,
      player: playerTile.player,
      selected: true,
    };
    setCurrentPlayer({ ...grid[i][j], i, j });
  };

  //this is just a fun test, using conway's game of life
  const simulate = () => {};

  const initGrid = () => {
    //lay down all the tiles
    for (let i = 0; i < 3; i++) {
      if (!grid[i]) grid[i] = [];
      for (let j = 0; j < 10; j++) {
        grid[i][j] = {
          tile: getTile(),
          selected: true,
        };
      }
    }

    //ADDING RANDOM CHRACTERS
    grid.map((g, i) => {
      g.map((gr, j) => {
        if ((i === 0 && j === 0) || (i === 2 && j === 9)) {
          grid[i][j] = {
            name: `x90`,
            tile: getTile(),
            player: j === 0 ? 0 : 1,
            characters: [getRandomCharacter()],
            count: 90,
            moved: false,
            type: "character",
            selected: true,
          };
        }
      });
    });
    setCurrentPlayer({ ...grid[0][0], i: 0, j: 0 });
    setOtherPlayer({ ...grid[2][9], i: 2, j: 9 });
    return setGrid(grid);
  };
  const updateGrid = (position1, position2, data) => {
    setGrid(
      grid.map((g, i) =>
        i === position1 ? g.map((gr, j) => (j === position2 ? data : gr)) : g
      )
    );
  };
  React.useEffect(() => {
    initGrid();
  }, []);
  //knowledgeflow.markab.io
  const childrenWithProps = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      grid: grid,
      updateGrid: updateGrid,
      onKeyPress,
    });
  });
  return <>{childrenWithProps}</>;
};
