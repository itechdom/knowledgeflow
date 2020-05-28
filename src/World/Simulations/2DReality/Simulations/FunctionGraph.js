import React from "react";
import Matter from "matter-js";
import { Grid, Button } from "@material-ui/core";
import { zoom } from "./Camera";
import Render from "../Matter/Render";
import { onGridResize } from "./Axes";
import Gravitation from "./Gravitation";
const origin = 100 * 5;
const factor = 100;
let interval;
let playerRef;
let rangeX;
let rangeY;
function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
const snapshot = () => {
  let canvas = document.getElementById("axes");
  let image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
  window.location.href = image; // it will save locally
};
const setBackground = (currentZoom) => {
  let canvas = document.getElementById("axes");
  canvas.style.background = `${
    currentZoom <= 0 || currentZoom > 3
      ? "url('/assets/game/background-1x.png')"
      : `url('/assets/game/background-${currentZoom}x.png')`
  }`;
};
const cartesian = (val) => {
  return val * factor + origin;
};
const checkBoundsX = (render, onExpansion) => {
  let rangeMin = (rangeX && rangeX[0]) || -13;
  let rangeMax = (rangeX && rangeX[1]) || 13;
  let boundMin = render.bounds.min.x;
  let boundMax = render.bounds.max.x;
  let newBoundMin = Math.ceil(boundMin / factor);
  let newBoundMax = Math.ceil(boundMax / factor);
  if (newBoundMin < rangeMin) {
    rangeX = [newBoundMin, rangeMax];
    onExpansion(rangeX);
  }
  if (newBoundMax > rangeMax) {
    rangeX = [rangeMin, newBoundMax];
    onExpansion(rangeX);
  }
};
const checkBoundsY = (render, onExpansion) => {
  let rangeMin = (rangeY && rangeY[0]) || -14;
  let rangeMax = (rangeY && rangeY[1]) || 14;
  let boundMin = render.bounds.min.y;
  let boundMax = render.bounds.max.y;
  let newBoundMin = Math.ceil(boundMin / factor);
  let newBoundMax = Math.ceil(boundMax / factor);
  if (newBoundMin < rangeMin) {
    rangeY = [newBoundMin, rangeMax];
    onExpansion(rangeY);
  }
  if (newBoundMax > rangeMax) {
    rangeY = [rangeMin, newBoundMax];
    onExpansion(rangeY);
  }
};
const FunctionGraph = ({
  initMatter,
  x,
  y,
  direction,
  width,
  height,
  funcs,
  ...rest
}) => {
  const [myEngine, setMyEngine] = React.useState();
  const [player, setPlayer] = React.useState();
  const [iter, setIter] = React.useState(0);
  const [currentZoom, setCurrentZoom] = React.useState(1);
  const [bounds, setBounds] = React.useState({});
  const prevBounds = usePrevious(bounds);
  const init = (options) => {
    const { engine, mouse, render, Render } = initMatter(
      "axes",
      "axes-container",
      options,
      true,
      {
        render: {
          zIndex: 100,
          fillStyle: "red",
          sprite: {
            // texture: "./assets/game/Tiles/dirt.png",
          },
        },
      }
    );
    let player = Matter.Bodies.circle(400, 100, 50, {
      restitution: 0.9,
      render: {
        zIndex: 9000,
        // sprite: {
        //   // texture: "./assets/game/Tiles/alienBeige.png",
        // },
        // text: {
        //   content: "Test",
        //   size: 16,
        //   color: "#FFF",
        //   family: "Ariel",
        // },
      },
    });
    playerRef = player;
    player.isPlayer = true;
    //reference frame
    let grid = Matter.Composites.stack(
      2.5,
      2.5,
      10,
      10,
      5,
      5,
      (x, y, column, row, lastBody, i) => {
        //restitution is the ratio of end velocity to beginning velocity
        let circle1 = Matter.Bodies.rectangle(x, y, 95, 95, {
          restitution: 0,
          isStatic: true,
          isSensor: true,
          angle: 0,
          mass: 0,
          render: {
            fillStyle: "black",
            strokeStyle: "white",
            sprite: {
              // texture: "assets/game/Tiles/tileGrass.png",
            },
            zindex: -1,
          },
        });
        return circle1;
      }
    );
    grid.label = "grid";
    let xAxis = Matter.Composites.stack(
      -100 * 10 + 50,
      origin,
      28,
      1,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let xAxis = Matter.Bodies.rectangle(x, y, 90, 10, {
          isStatic: true,
          render: {
            zIndex: 2000,
            fillStyle: "red",
            text: {
              content: `${i - 14}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return xAxis;
      }
    );
    xAxis.label = "xAxis";
    let yAxis = Matter.Composites.stack(
      origin,
      -100 * 10 + 50,
      1,
      28,
      10,
      10,
      (x, y, column, row, lastBody, i) => {
        let yAxis = Matter.Bodies.rectangle(x, y, 10, 90, {
          isStatic: true,
          isSensor: true,
          render: {
            zIndex: 1000,
            fillStyle: "red",
            text: {
              content: `${14 - i}`,
              size: 18,
              color: "#FFF",
            },
          },
        });
        return yAxis;
      }
    );
    yAxis.label = "yAxis";
    let point = Matter.Bodies.circle(5, 5, 5, {
      isStatic: true,
      render: {
        zIndex: 2000,
        fillStyle: "black",
      },
    });
    Matter.Events.on(engine, "beforeUpdate", () => {
      player.render.text = {
        content: `${((player.position.x - origin) / 100).toFixed(1)},${(
          (-1 * (player.position.y - origin)) /
          100
        ).toFixed(1)}`,
      };
      Render.lookAt(render, {
        min: {
          x: player.position.x - 500 * currentZoom,
          y: player.position.y - 500 * currentZoom,
        },
        max: {
          x: player.position.x + 500 * currentZoom,
          y: player.position.y + 500 * currentZoom,
        },
      });
      //check if we exceed the x axis
      checkBoundsX(render, (newBounds) => {
        setBounds({
          min: { x: cartesian(newBounds[0]), y: render.bounds.min.y },
          max: { x: cartesian(newBounds[1]), y: render.bounds.max.y },
        });
      });
      checkBoundsY(render, () => {
        setBounds({
          min: { y: cartesian(newBounds[0]), x: render.bounds.min.x },
          max: { y: cartesian(newBounds[1]), x: render.bounds.max.x },
        });
      });
    });
    Matter.World.add(engine.world, [xAxis, yAxis, player]);
    setBounds({ ...render.bounds });
    setPlayer(player);
    setMyEngine({ ...engine, render });
  };
  React.useEffect(() => {
    if (!player || !myEngine) {
      return;
    }
    const { x, y } = player.position;
    const magnitude = 0.09;
    if (direction === "left") {
      return Matter.Body.applyForce(player, { x, y }, { x: -magnitude, y: 0 });
    } else if (direction === "right") {
      return Matter.Body.applyForce(player, { x, y }, { x: magnitude, y: 0 });
    } else if (direction === "up") {
      if (currentZoom < 3) {
        setCurrentZoom(currentZoom + 1);
        // setBackground(currentZoom + 1);
        setBounds({ ...myEngine.render.bounds });
      }
      // let newGrid = onGridResize({ myEngine });
      // Matter.World.add(myEngine.world, newGrid);
      return Matter.Body.applyForce(
        player,
        { x, y },
        { x: 0, y: -magnitude * 2 }
      );
    } else if (direction === "down") {
      if (currentZoom > 0) {
        setCurrentZoom(currentZoom - 1);
        // setBackground(currentZoom - 1);
        setBounds({ ...myEngine.render.bounds });
      }
      return Matter.Body.applyForce(
        player,
        { x, y },
        { x: 0, y: magnitude * 2 }
      );
    }
  }, [direction, x, y]);
  //this effect will draw only when the boundries change
  React.useEffect(() => {
    if (interval) {
      clearInterval(interval);
    }
    //range
    if (bounds.min) {
      let { min: minPrev, max: maxPrev } = prevBounds;
      let { min, max } = bounds;
      let playerPosition = player.position;
      funcs.map((func) => {
        let x = Math.ceil(playerPosition.x / factor - origin / factor);
        let y = func(x);
        let point = Matter.Bodies.circle(cartesian(x), cartesian(-1 * y), 20, {
          isStatic: true,
          render: {
            zIndex: 3000,
            fillStyle: "black",
            text: {
              content: `${x},${func(x).toFixed(1)}`,
              size: 12,
              color: "#FFF",
            },
          },
        });
        return Matter.World.add(myEngine.world, point);
      });
    }
  }, [bounds]);
  React.useEffect(() => {
    init({
      wireframes: false,
      // background: "url('/assets/game/background-1x.png')",
      background: "#000000",
      showAngleIndicator: false,
      width: 2000,
      height: 2000,
    });
  }, []);
  return (
    <Grid item style={{ marginTop: "10px", marginBottom: "10em" }}>
      <Grid alignItems="center" justify="center" container id="axes-container">
        <Grid xs={12} item>
          <canvas id="axes"></canvas>
          {myEngine && (
            <Gravitation
              initMatter={() => {
                return {
                  engine: myEngine,
                  Render: Render,
                  render: myEngine.render,
                };
              }}
            />
          )}
          <Button onClick={() => snapshot()}>snapshot</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default FunctionGraph;
