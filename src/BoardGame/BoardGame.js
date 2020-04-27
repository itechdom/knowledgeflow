import React from "react";
import { getRandomInt } from "./utils";
import { Grid } from "@material-ui/core";
let fpsInterval, then;
const animate = (onDraw) => {
  // request another frame
  requestAnimationFrame(animate.bind(onDraw));

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
const Tile = (type) => {};
export const GameState = ({ children, knowledge }) => {
  //rendered grid
  //grid: array of arrays, imageUrl, number of soldiers
  const [grid, setGrid] = React.useState([]);
  //phase of the game
  const [phase, setPhase] = React.useState();
  //we are going to pick a random knowledge, then pick a random branch
  //setup a map
  const getTile = (tile, selected) => {
    const tiles = [
      "Grass",
      "Dirt",
      "Lava",
      "Magic",
      "Sand",
      "Snow",
      "Stone",
      "Water",
    ];
    if (tile) {
      if (selected) {
        return `${tile.url.replace("_tile", "")}`;
      }
      if (tile.url.indexOf("_tile") === -1) {
        return `${tile.url.replace(".png", "")}_tile.png`;
      }
      return tile.url;
    }
    return `/assets/game/hexagonTiles/Tiles/tile${
      tiles[getRandomInt(0, tiles.length - 1)]
    }_tile.png`;
  };
  const getRandomKnowledge = () => {};
  const initGrid = () => {
    for (let i = 0; i < 20; i++) {
      if (!grid[i]) grid[i] = [];
      for (let j = 0; j < 10; j++) {
        grid[i][j] = { name: `${i}x${j}`, url: getTile(), selected: false };
      }
    }
    setGrid(grid);
  };
  const updateAllGrids = (data) => {
    setGrid([...data]);
  };
  const selectGrid = (i, j) => {
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
    console.log(grid, "GRID");
  };
  const unSelectAll = (grid) => {
    const newGrid = grid.map((g, i) => {
      return g.map((gr, j) => {
        return { ...gr, selected: false, url: getTile(grid[i][j], false) };
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
    data ? unSelectAll(grid) : "";
  };
  React.useEffect(() => {
    animate(() => {
      console.log("ANIMATE");
    });
  }, []);
  return (
    <Grid
      container
      style={{
        width: "100%",
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
        style={{ marginTop: "3em" }}
      >
        {grid.length > 0 ? (
          grid.map((g, i) => (
            <Grid
              container
              style={{
                position: "relative",
                bottom: `${45 * (i + 1)}px`,
                left: (i + 1) % 2 !== 0 ? "30px" : "0px",
              }}
              justify="center"
            >
              {g.map((gr, j) => (
                <Grid
                  style={{
                    width: "56px",
                    height: "85px",
                    zIndex: gr.selected ? "999" : "0",
                  }}
                  item
                  onClick={(ev) => {
                    ev.stopPropagation();
                    return selectGrid(i, j);
                  }}
                >
                  <span
                    style={{
                      padding: "2px",
                      // background: "white",
                      color: "white",
                      textShadow: "black 0px 1px 1px",
                      position: "relative",
                      left: "24px",
                      top: "48px",
                    }}
                  >
                    {gr.name}
                  </span>
                  <img
                    data-id="tile"
                    style={{
                      boxShadow: gr.selected ? "#00000061 0px 1px 9px" : "",
                      padding: "3px 5px",
                      position: "relative",
                      // right: "10px",
                    }}
                    src={gr.url}
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
