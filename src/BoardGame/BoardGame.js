import React from "react";
import {
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogContent,
  Button,
} from "@material-ui/core";
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
export const Game = ({
  grid,
  updateGrid,
  unSelectAll,
  selectGrid,
  phase,
  currentPlayer,
}) => {
  const [paused, setPaused] = React.useState(true);
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
      className="game"
      container
      style={{
        width: "100%",
        minWidth: "800px",
        overflow: "scroll",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#8BE1EB",
      }}
      onClick={(ev) => {
        handleClick(ev, "container");
      }}
    >
      <Dialog className="game" open={paused} onClose={() => setPaused(false)}>
        <Grid justify="center" container>
          <Grid item>
            <Paper
              style={{
                padding: "2px",
                color: "white",
                minWidth: "400px",
                textShadow: "black 0px 1px 1px",
                zIndex: 400,
                textAlign: "center",
                backgroundColor: "#A681B5",
                // backgroundColor: "gray",
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)",
              }}
            >
              <h1>Paused!</h1>
              <Divider></Divider>
              <h2>Resume</h2>
              <Divider></Divider>
              <h2>Help</h2>
              <Divider></Divider>
              <h2>Restart</h2>
              <Divider></Divider>
              <h2>Quit</h2>
            </Paper>
          </Grid>
        </Grid>
      </Dialog>
      <Grid
        style={{
          padding: "2px",
          color: "white",
          textShadow: "black 0px 1px 1px",
          zIndex: 400,
          textAlign: "center",
        }}
        direction="column"
        justify="center"
        container
      >
        <Grid item>
          <h1>Knowledge Board !</h1>
        </Grid>
        {currentPlayer === 0 && (
          <Grid item>
            <h1>Player 1's turn</h1>
          </Grid>
        )}
        {currentPlayer === 1 && (
          <Grid item>
            <h1>Player 2's turn</h1>
          </Grid>
        )}
        {phase === 0 && (
          <Grid item>
            <h1>Phase 1 : Move</h1>
          </Grid>
        )}
        {phase === 1 && (
          <Grid item>
            <h1 style={{ color: "#E97B33" }}>Phase 2 : Attack</h1>
          </Grid>
        )}
        {phase === 2 && (
          <Grid item>
            <h1 style={{ color: "#8DC434" }}>Phase 3 : Rienforce</h1>
          </Grid>
        )}
        <Grid item>
          <Grid container justify="center">
            <Button className="game_button" variant="outlined">
              <h1 className="game">End Turn!</h1>
            </Button>
            {/* <Button
              className="game_button_cancel"
              style={{ marginLeft: "10px" }}
              variant="outlined"
            >
              <h1 className="game">help!</h1>
            </Button> */}
          </Grid>
        </Grid>
      </Grid>
      <Grid container justify="center" direction="row">
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
                    position: "relative",
                  }}
                  item
                >
                  {gr.environment &&
                    gr.environment.map((env, index) => (
                      <img
                        data-id={`${i}-${j}`}
                        style={{
                          position: "absolute",
                          left: `${(index / 2) * 24}px`,
                          top: `${48}px`,
                          display: "inline",
                          height: gr.type === "background" ? "auto" : "87px",
                          zIndex: gr.type === "background" ? 150 : 300,
                          visibility:
                            !gr.display && gr.selected ? "" : "hidden",
                        }}
                        src={env}
                      />
                    ))}
                  {gr.type === "character" && (
                    <span
                      data-id={`${i}-${j}`}
                      style={{
                        padding: "2px",
                        color: "white",
                        textShadow: "black 0px 1px 1px",
                        fontSize: 18,
                        position: "absolute",
                        left: "48px",
                        top: "48px",
                        display: "inline-block",
                        zIndex: 400,
                      }}
                    >
                      {gr.name}
                    </span>
                  )}
                  <img
                    data-id={`${i}-${j}`}
                    style={{
                      padding: "3px 5px",
                      position: "absolute",
                      top: 84,
                      left: 0,
                      zIndex: gr.type === "background" ? 100 : 200,
                      opacity: gr.selected ? 1 : 0.25,
                    }}
                    src={gr.url}
                    onClick={(ev) => {}}
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
