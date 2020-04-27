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
  const getTile = () => {
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
    return `/assets/game/hexagonTiles/Tiles/tile${
      tiles[getRandomInt(0, tiles.length - 1)]
    }.png`;
  };
  const getRandomKnowledge = () => {};
  const initGrid = () => {
    for (let i = 0; i < 5; i++) {
      if (!grid[i]) grid[i] = [];
      for (let j = 0; j < 5; j++) {
        grid[i][j] = { name: `${i}x${j}`, url: getTile() };
      }
    }
    setGrid(grid);
  };
  const updateGrid = (position, data) => {};
  const RollADice = () => {};
  const onDraw = () => {};
  React.useEffect(() => {
    initGrid();
    setPhase("0-a");
  }, []);
  //knowledgeflow.markab.io
  const childrenWithProps = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      grid: grid,
      updateGrid: updateGrid,
      RollADice: RollADice,
    });
  });
  return <>{childrenWithProps}</>;
};
export const Game = ({ grid }) => {
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
              justify="center"
              // style={{ border: "1px solid black" }}
            >
              {g.map((gr, j) => (
                <Grid style={{ width: "65.5px", height: "80px" }} item>
                  <span
                    style={{
                      padding: "2px",
                      // background: "white",
                      color: "white",
                      textShadow: "black 0px 1px 1px",
                      position: "relative",
                      left: "20px",
                      top: "45px",
                    }}
                  >
                    {gr.name}
                  </span>
                  <img src={gr.url} />
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
