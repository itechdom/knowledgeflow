import React from "react";
import { Grid } from "@material-ui/core";
import CheckboxInput from "../orbital-templates/Material/_shared/Forms/Inputs/Forms.CheckboxInput";
import TextFieldInput from "../orbital-templates/Material/_shared/Forms/Inputs/Forms.TextFieldInput";
const MatterOptions = ({ init, myEngine }) => {
  const [options, setOptions] = React.useState({
    showAngleIndicator: false,
    wireframes: false,
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
    init(options);
  }, [options]);
  React.useEffect(() => {
    if (myEngine) {
      Object.keys(properties).map((prop) => {
        myEngine.world.bodies[4][prop] = properties[prop];
      });
    }
  }, [properties]);
  return (
    <>
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
    </>
  );
};

export default MatterOptions;
