import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
import SelectInput from "../../orbital-templates/Material/_shared/Forms/Inputs/Forms.SelectInput";

const Math = ({ engine, x, y, direction, initMatter, onUpdate }) => {
  const [myEngine, setMyEngine] = React.useState();
  const [options, setOptions] = React.useState([
    "showDebug",
    "showPositions",
    "showBounds",
    "showVelocity",
  ]);
  React.useEffect(() => {
    const { engine } = initMatter("math", "math-container", {
      showDebug: true,
      showPositions: true,
      showBounds: true,
      showVelocity: true,
    });
    //restitution is the ratio of end velocity to beginning velocity
    let circle1 = Matter.Bodies.circle(100, 100, 100, {
      restitution: 1,
    });
    let circles = [circle1];
    Matter.Events.on(engine, "beforeUpdate", () => {});
    Matter.World.add(engine.world, circles);
    setMyEngine(engine);
  }, []);
  return (
    <Grid id="math-container" item>
      <SelectInput
        field={{ options }}
        setFieldValue={(k, v) => console.log(k, v)}
        values={{}}
      />
      <canvas id="math"></canvas>
    </Grid>
  );
};
export default Math;
