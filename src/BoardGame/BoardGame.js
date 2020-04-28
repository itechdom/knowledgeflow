import React from "react";
import { getRandomInt } from "./utils";
import { Grid } from "@material-ui/core";
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
//the problem here is each tile has a specific type of terrain
const sceneObjects = [];

const characters = [];
let fpsInterval = 1000 / 60,
  then = Date.now();
const animate = (onDraw) => {
  // request another frame
  requestAnimationFrame(animate.bind(null, onDraw));
  // calc elapsed time since last loop
  let now = Date.now();
  let elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);
    onDraw();
  }
};
export const GameState = ({ children, knowledge }) => {
  //rendered grid
  //grid: array of arrays, imageUrl, number of soldiers
  const [grid, setGrid] = React.useState([]);
  //phase of the game
  const [phase, setPhase] = React.useState();
  //we are going to pick a random knowledge, then pick a random branch
  //setup a map
  const getATile = (tile) => {
    let suffix = "";
    if (tile === "Water") {
      suffix = "_shadow";
    }
    return `http://knowledgeflow.markab.io.s3-website-us-east-1.amazonaws.com/game/hexagonTiles/Tiles/tile${tile}${suffix}.png`;
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
    return `http://knowledgeflow.markab.io.s3-website-us-east-1.amazonaws.com/game/hexagonTiles/Tiles/tile${
      tiles[getRandomInt(0, tiles.length - 1)]
    }${suffix}.png`;
  };
  const getRandomSceneObjects = (grid) => {};
  const getSurroundingWater = (grid) => {};
  const getRandomKnowledge = () => {};
  const initGrid = () => {
    for (let i = 0; i < 9; i++) {
      if (!grid[i]) grid[i] = [];
      if (i === 0 || i === 1) {
        for (let j = 0; j < 10; j++) {
          grid[i][j] = {
            name: `Water`,
            url: getATile("Water"),
            selected: true,
          };
        }
      } else {
        for (let j = 0; j < 10; j++) {
          grid[i][j] = { name: `${i}x${j}`, url: getTile(), selected: false };
        }
      }
    }
    grid.map((g, i) => {
      for (let a = 0; a < 9; a++) {
        g.unshift({ name: `Water`, url: getATile("Water"), selected: true });
        g.push({ name: `Water`, url: getATile("Water"), selected: true });
      }
    });
    for (let b = 0; b < 3; b++) {
      let initialLength = grid.length;
      for (let a = 0; a < 28; a++) {
        if (!grid[initialLength]) {
          grid[initialLength] = [];
        }
        grid[initialLength].push({
          name: `Water`,
          url: getATile("Water"),
          selected: true,
        });
      }
    }
    //generate random scene object
    setGrid(grid);
  };
  const updateAllGrids = (data) => {
    setGrid([...data]);
  };
  const selectGrid = (i, j) => {
    console.log(grid[i][j]);
    if (grid[i][j].name === "Water") {
      return;
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
        if (gr.name !== "Water") {
          return { ...gr, selected: false, url: getTile(grid[i][j], false) };
        }
        return { ...gr };
      });
    });
    setGrid([...newGrid]);
  };
  const RollADice = () => {};
  const onDraw = () => {};
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
export const Game = ({ grid, updateGrid, unSelectAll, selectGrid }) => {
  const handleClick = (ev, data) => {
    let pos = ev.target.dataset.id;
    if (pos) {
      let arr = pos.split("-");
      return selectGrid(parseInt(arr[0]), parseInt(arr[1]));
    }
    return unSelectAll(grid);
  };
  React.useEffect(() => {
    // animate(() => {
    //   console.log("ANIMATE");
    // });
  }, []);
  return (
    <Grid
      container
      style={{
        width: "100%",
        minWidth: "1300px",
        overflow: "scroll",
        marginLeft: "auto",
        marginRight: "auto",
      }}
      onClick={(ev) => {
        handleClick(ev, "container");
      }}
    >
      <Grid
        container
        justify="center"
        direction="row"
      >
        {grid.length > 0 ? (
          grid.map((g, i) => (
            <Grid
              container
              style={{
                position: "relative",
                bottom: `${15 * (i + 1)}px`,
                left: (i + 1) % 2 === 0 ? "33px" : "0px",
              }}
              justify="center"
            >
              {g.map((gr, j) => (
                <Grid
                  style={{
                    width: "65px",
                    height: "85px",
                  }}
                  item
                >
                  <span
                    data-id={`${i}-${j}`}
                    style={{
                      padding: "2px",
                      // background: "white",
                      color: "white",
                      textShadow: "black 0px 1px 1px",
                      position: "relative",
                      left: "24px",
                      top: "48px",
                      display: "inline-block",
                      zIndex: 400,
                    }}
                  >
                    {/* {gr.name} */}
                  </span>
                  <img
                    data-id={`${i}-${j}`}
                    style={{
                      padding: "3px 5px",
                      position: "relative",
                      zIndex: 300,
                      opacity: gr.selected ? 1 : 0.25,
                    }}
                    src={gr.url}
                    onClick={(ev) => {
                      console.log("hello");
                      // return selectGrid(i, j);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ))
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
};
export default Game;
