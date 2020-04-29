import React from "react";
import { Grid } from "@material-ui/core";
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
        minWidth: "2000px",
        overflow: "scroll",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#8BE1EB",
      }}
      onClick={(ev) => {
        handleClick(ev, "container");
      }}
    >
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
                  {gr.environment &&
                    gr.environment.map((env, index) => (
                      <img
                        data-id={`${i}-${j}`}
                        style={{
                          position: "relative",
                          left: `${(index / 2) * 24}px`,
                          top: `${48}px`,
                          display: "inline-block",
                          zIndex: gr.type === "background" ? 100 : 300,
                          visibility:
                            !gr.display && gr.selected ? "" : "hidden",
                        }}
                        src={env}
                      />
                    ))}
                  <img
                    data-id={`${i}-${j}`}
                    style={{
                      padding: "3px 5px",
                      position: "relative",
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
