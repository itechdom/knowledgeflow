import React from "react";
import {
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogContent,
  Tooltip,
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
  endTurn,
}) => {
  const [paused, setPaused] = React.useState(true);
  const handleClick = (ev) => {
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
        handleClick(ev);
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
        <Grid container justify="center">
          {currentPlayer === 0 && (
            <Grid item>
              <h1>
                Player <b>1</b> -
              </h1>
            </Grid>
          )}
          {currentPlayer === 1 && (
            <Grid item>
              <h1>
                Player <b>2</b> -
              </h1>
            </Grid>
          )}
          {phase === 0 && (
            <Grid item>
              <h1>Move</h1>
            </Grid>
          )}
          {phase === 1 && (
            <Grid item>
              <h1 style={{ color: "#E97B33" }}>Attack</h1>
            </Grid>
          )}
          {phase === 2 && (
            <Grid item>
              <h1 style={{ color: "#8DC434" }}>Rienforce</h1>
            </Grid>
          )}
          {/* <Grid item>
            <Grid container justify="center">
              <Button className="game_button" variant="outlined">
                <h1 onClick={() => endTurn()} className="game">
                  End Turn!
                </h1>
              </Button>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid container justify="center" direction="row">
        {grid.length > 0 ? (
          grid.map((g, i) => (
            <Grid
              container
              style={{
                position: "relative",
                bottom: `${i + 1}px`,
                left: (i + 1) % 2 === 0 ? "33px" : "0px",
              }}
              justify="center"
            >
              {g.map((gr, j) => (
                <Tooltip
                  title={
                    gr.type === "character"
                      ? j === 0
                        ? "This is you!"
                        : "Player2"
                      : ""
                  }
                >
                  <Grid
                    style={{
                      width: "70px",
                      height: "85px",
                      position: "relative",
                    }}
                    item
                  >
                    {gr.environment &&
                      gr.environment.map((env, index) => (
                        <img
                          data-id={`${i}-${j}`}
                          id={`${i}-${j}`}
                          className={
                            gr.type === "character" ? "game_character" : ""
                          }
                          style={{
                            position: "absolute",
                            left: gr.type === "character" ? "0px" : `48px`,
                            bottom:
                              gr.type === "character" ? `${24}px` : "33px",
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
                        id={`${i}-${j}`}
                        style={{
                          padding: "2px",
                          color: "white",
                          textShadow: "black 0px 1px 1px",
                          fontSize: 18,
                          position: "absolute",
                          left: "48px",
                          bottom: "84px",
                          display: "inline-block",
                          zIndex: 400,
                        }}
                      >
                        {gr.name}
                      </span>
                    )}
                    <img
                      data-id={`${i}-${j}`}
                      id={`${i}-${j}`}
                      style={{
                        padding: "3px 5px",
                        position: "absolute",
                        left: 0,
                        boxShadow: gr.guide ? "green 0px 0px 15px" : "",
                        borderRadius: gr.guide ? "50px" : "",
                        zIndex: gr.type === "background" ? 100 : 200,
                        opacity: gr.selected ? 1 : 0.25,
                      }}
                      src={gr.url}
                      onClick={(ev) => {}}
                    />
                    {gr.guide ? (
                      <span
                        data-id={`${i}-${j}`}
                        id={`${i}-${j}`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleClick(ev);
                        }}
                        style={{
                          position: "absolute",
                          top: 24,
                          left: 12,
                          zIndex: 9999,
                          color: "white",
                          textShadow: "black 0px 1px 1px",
                          cursor: gr.guide ? "pointer" : "inherit",
                        }}
                      >
                        move here
                      </span>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Tooltip>
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
