import React from "react";
import Matter from "matter-js";
import { Grid } from "@material-ui/core";
export const zoom = (Render, render, min, max) => {
  Render.lookAt(render, {
    min: { x: min, y: min },
    max: { x: max, y: max },
  });
};
