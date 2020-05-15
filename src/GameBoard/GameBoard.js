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
import TextField from "../orbital-templates/Material/_shared/Forms/Inputs/Forms.TextFieldInput";
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
const renderDialog = ({ title, message, yes, no, onYes, onNo, extra }) => {
  return (
    <Dialog open={true} onClose={onNo} aria-labelledby="form-dialog-title">
      <Grid container alignItems={"flex-end"} justify={"flex-end"}>
        <Grid item>
          <Button onClick={onNo}>
            <Icon>close</Icon>
          </Button>
        </Grid>
      </Grid>
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        {extra ? extra : <></>}
      </DialogContent>
      <DialogActions>
        {yes && (
          <Button onClick={onYes} variant="contained" color="secondary">
            {yes}
          </Button>
        )}
        {no && (
          <Button onClick={onNo} variant="outlined" color="primary">
            {no}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
export const Game = ({
  grid,
  selectGrid,
  phase,
  onKeyPress,
  currentPlayer,
  unSelectAll,
}) => {
  const [paused, setPaused] = React.useState(false);
  const [numberDialog, setNumberDialog] = React.useState();
  const [currentNumber, setCurrentNumber] = React.useState(0);
  const [currentLimit, setCurrentLimit] = React.useState(90);
  const renderNumberDialog = () => {
    let [i, j] = numberDialog;
    let tile = grid[i][j];
    return renderDialog({
      title: "How many aliens do you want to move",
      onYes: () => {
        setNumberDialog(null);
        selectGrid(parseInt(i), parseInt(j), parseInt(currentNumber));
      },
      onNo: () => setNumberDialog(null),
      yes: "Confirm",
      no: "Cancel",
      extra: (
        <TextField
          type="number"
          field={{ name: "alien-count" }}
          setFieldValue={(key, value) => {
            setCurrentNumber(value);
          }}
          value={currentNumber}
          max={currentLimit}
          min={i}
          standAlone={true}
        />
      ),
    });
  };
  const handleClick = (ev) => {
    let pos = ev.target.dataset.id;
    if (pos) {
      let arr = pos.split("-");
      let [i, j] = arr;
      let tile = grid[i][j];
      //display dialog to get the number of aliens moved
      tile.guide
        ? setNumberDialog(arr)
        : selectGrid(parseInt(arr[0]), parseInt(arr[1]));
      return;
    }
  };
  React.useEffect(() => {
    // animate(() => {
    //   console.log("ANIMATE");
    // });
  }, [phase]);
  console.log(grid);
  return (
    <Grid
      className="game"
      container
      style={{
        overflow: "hidden",
        backgroundColor: "#8BE1EB",
      }}
      onClick={(ev) => {
        handleClick(ev);
      }}
      justify="center"
    >
      {numberDialog && renderNumberDialog()}
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
        <Grid
          style={{
            marginBottom: "5em",
            padding: "3em",
          }}
          item
        >
          <h1>Plan !</h1>
          <h3>Select tiles to move characters</h3>
        </Grid>
      </Grid>
      <Grid
        container
        justify="center"
        style={{
          width: "1920px",
        }}
        direction="row"
      >
        {grid.length > 0 ? (
          grid.map((g, i) => (
            <Grid
              container
              key={`${i}-container`}
              style={{
                position: "relative",
                bottom: `${15 * (i + 1)}px`,
                left: (i + 1) % 2 === 0 ? "33px" : "0px",
              }}
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
                        data-id={`${i}-${j}-character`}
                        id={`${i}-${j}-environment`}
                        key={`${i}-${j}-environment`}
                        style={{
                          position: "absolute",
                          left: `48px`,
                          bottom: "33px",
                          display: "inline",
                          // height: gr.type === "background" ? "auto" : "87px",
                          zIndex: gr.type === "background" ? 150 : 300,
                          // opacity: gr.selected ? 1 : 0.25,
                        }}
                        src={env}
                      />
                    ))}
                  {gr.knowledge && (
                    <Tooltip
                      data-id={`${i}-${j}-character`}
                      id={`${i}-${j}-environment`}
                      key={`${i}-${j}-environment`}
                      style={{
                        position: "absolute",
                        left: `48px`,
                        bottom: "33px",
                        display: "inline",
                        zIndex: gr.type === "background" ? 150 : 300,
                      }}
                      title={gr.knowledge.title}
                    ></Tooltip>
                  )}
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
                      padding: "3px 0px",
                      position: "absolute",
                      left: 0,
                      boxShadow: gr.guide ? "green 0px 0px 15px" : "",
                      borderRadius: gr.guide ? "50px" : "",
                      zIndex: gr.type === "background" ? 100 : 200,
                      // opacity: gr.selected ? 1 : 0.25,
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
