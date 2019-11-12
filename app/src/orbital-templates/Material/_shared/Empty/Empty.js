import React from "react";
import { withStyles } from "@material-ui/styles";
import { styles } from "./Empty.styles";
import { Grid } from "@material-ui/core";

function Empty(props) {
  const { modelName } = props;
  return (
    <React.Fragment>
      <Grid
        style={{ minHeight: "250px" }}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            width="160"
            height="160"
          >
            <path
              fill="#ffc49c"
              d="M4.5 75.5L4.5 14.2 14.2 4.5 65.8 4.5 75.5 14.2 75.5 75.5z"
            />
            <path
              fill="#a16a4a"
              d="M65.6,5l9.4,9.4V75H5V14.4L14.4,5H65.6 M66,4H14L4,14v62h72V14L66,4L66,4z"
            />
            <path
              fill="#d6976d"
              d="M65.5 15.5L65.5 4.5 65.8 4.5 75.5 14.2 75.5 15.5z"
            />
            <path
              fill="#a16a4a"
              d="M66,5.4l9,9V15h-9V5.4 M66,4h-1v12h11v-2L66,4L66,4z"
            />
            <path
              fill="#d6976d"
              d="M4.5 15.5L4.5 14.2 14.2 4.5 14.5 4.5 14.5 15.5z"
            />
            <path
              fill="#a16a4a"
              d="M14,5.4V15H5v-0.6L14,5.4 M15,4h-1L4,14v2h11V4L15,4z"
            />
            <path fill="#a16a4a" d="M4 15H76V16H4z" />
            <g>
              <path
                fill="#a16a4a"
                d="M48,24h-8h-8c-1.1,0-2,0.9-2,2s0.9,2,2,2h8h8c1.1,0,2-0.9,2-2C50,24.9,49.1,24,48,24z"
              />
            </g>
          </svg>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withStyles(styles)(Empty);
