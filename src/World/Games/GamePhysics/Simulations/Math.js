import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
import CheckboxInput from "../../../../orbital-templates/Material/_shared/Forms/Inputs/Forms.CheckboxInput";
import TextFieldInput from "../../../../orbital-templates/Material/_shared/Forms/Inputs/Forms.TextFieldInput";

const Math = ({ engine, x, y, direction, initMatter, onUpdate }) => {
  const [myEngine, setMyEngine] = React.useState();
  const [options, setOptions] = React.useState({
    showAngleIndicator: false,
    wireframes: true,
    showDebug: false,
    showPositions: false,
    showBounds: false,
    showVelocity: false,
    showAxes: false,
  });
  const [properties, setProperties] = React.useState({
    density: 0,
    friction: 0,
    frictionStatic: 0,
    frictionAir: 0,
    restitution: 0,
    chamfer: 0,
  });
  React.useEffect(() => {
    const { engine } = initMatter("math", "math-container", options);
    //restitution is the ratio of end velocity to beginning velocity
    let circle1 = Matter.Bodies.circle(100, 100, 100, {
      restitution: 1,
    });
    circle1.restitution = 0;
    let circles = [circle1];
    Matter.Events.on(engine, "beforeUpdate", () => {});
    Matter.World.add(engine.world, circles);
    setMyEngine(engine);
  }, [options]);
  React.useEffect(() => {
    if (myEngine) {
      Object.keys(properties).map((prop) => {
        myEngine.world.bodies[4][prop] = properties[prop];
        console.log(myEngine.world.bodies, "bodies");
      });
    }
  }, [properties]);
  return (
    <Grid item style={{ marginTop: "10px" }}>
      <Grid alignItems="center" justify="center" container id="math-container">
        <Grid style={{ marginLeft: "auto", marignRight: "auto" }} xs={12} item>
          <Grid justify="center" container>
            {Object.keys(options).map((op) => {
              return (
                <Grid item>
                  <CheckboxInput
                    field={{ placeholder: op }}
                    setFieldValue={(k, v) =>
                      setOptions({ ...options, [op]: !options[op] })
                    }
                    checked={options[op]}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Grid justify="center" container>
            {Object.keys(properties).map((op) => {
              return (
                <Grid item>
                  <TextFieldInput
                    field={{ placeholder: op, name: op }}
                    // value={myEngine && myEngine.world.bodies[0][op]}
                    type="number"
                    standAlone={true}
                    setFieldValue={(k, v) => {
                      console.log(k, v);
                      setProperties({ ...properties, [op]: v });
                    }}
                    checked={options[op]}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid xs={12} item>
          <canvas id="math"></canvas>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Math;
