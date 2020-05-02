import React from "react";
import {
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Icon,
  Button,
  Typography,
} from "@material-ui/core";
import KeyboardEventHandler from "react-keyboard-event-handler";
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
export const Game = ({ grid, phase, currentPlayer, onKeyPress }) => {
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    // animate(() => {
    //   console.log("ANIMATE");
    // });
    console.log("each group of players can move only once");
    console.log(
      "when a new phase is on, display a dialog that automatically disappears explaining what the phase is"
    );
  }, [phase]);
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
          <h1>Fight !</h1>
        </Grid>
      </Grid>
      <Grid container justify="center" direction="row">
        {grid.length > 0 ? (
          grid.map((g, i) => (
            <Grid
              container
              key={`${i}-container`}
              style={{
                position: "relative",
                bottom: `${30 * (i + 1)}px`,
                left: (i + 1) % 2 === 0 ? "33px" : "0px",
              }}
              justify="center"
            >
              {g.map((gr, j) => (
                <Tooltip
                  key={`${i}-${j}-tooltip`}
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
                      width: "65px",
                      height: "85px",
                      position: "relative",
                    }}
                    item
                  >
                    {gr.messages &&
                      gr.messages.map((msg, index) => (
                        <svg
                          className={"move-right"}
                          style={{
                            position: "absolute",
                            left: "48px",
                            bottom: "20px",
                            display: "absolute",
                            zIndex: 999,
                          }}
                          height="50"
                          width="50"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="10"
                            stroke="black"
                            strokeWidth="3"
                            fill="red"
                          />
                        </svg>
                      ))}
                    {gr.characters &&
                      gr.characters.map((env, index) => (
                        <img
                          data-id={`${i}-${j}-character`}
                          id={`${i}-${j}-character`}
                          key={`${i}-${j}-character`}
                          className={"game_character"}
                          style={{
                            position: "absolute",
                            left: "0px",
                            bottom: `${24}px`,
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
                        data-id={`${i}-${j}-count`}
                        id={`${i}-${j}-count`}
                        key={`${i}-${j}-count`}
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
                        {gr.count}
                      </span>
                    )}
                    <img
                      data-id={`${i}-${j}-title`}
                      id={`${i}-${j}-tile`}
                      key={`${i}-${j}-tile`}
                      style={{
                        padding: "3px 5px",
                        position: "absolute",
                        left: 0,
                        boxShadow: gr.guide ? "green 0px 0px 15px" : "",
                        borderRadius: gr.guide ? "50px" : "",
                        zIndex: gr.type === "background" ? 100 : 200,
                        opacity: gr.selected ? 1 : 0.25,
                      }}
                      src={gr.tile}
                      onClick={(ev) => {}}
                    />
                    {gr.guide ? (
                      <span
                        data-id={`${i}-${j}-guide`}
                        id={`${i}-${j}-guide`}
                        key={`${i}-${j}-guide`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleClick(ev);
                        }}
                        style={{
                          position: "absolute",
                          top: 24,
                          left: 12,
                          zIndex: 999,
                          color: "white",
                          textShadow: "black 0px 1px 1px",
                          cursor: gr.guide ? "pointer" : "inherit",
                        }}
                      >
                        here
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
      <KeyboardEventHandler
        handleKeys={["all"]}
        onKeyEvent={(key, e) => onKeyPress(key)}
      />
    </Grid>
  );
};
export default Game;
