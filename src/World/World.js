import React from "react";
import { styles } from "./World.styles.js";
import theme from "Theme";
import { withStyles, Button } from "@material-ui/core";
import { Game as PhysicsGame } from "./Simulations/2DReality/GamePhysics";
import { GameState as PhysicsGameState } from "./Simulations/2DReality/GamePhysics.state";
import { Grid } from "@material-ui/core";
import Reality from "./Simulations/Reality/Reality";
const World = ({
  knowledge,
  knowledge_createModel,
  knowledge_getModel,
  knowledge_updateModel,
  knowledge_deleteModel,
  knowledge_searchModel,
  knowledge_gallery_upload,
  knowledge_media_upload,
  knowledge_media_delete,
  knowledge_count,
  knowledge_set_filter,
  knowledge_remove_filter,
  location,
  match,
  history,
  classes,
  form,
  notifications,
  saveNotification,
  removeNotification,
  modelName,
  getUnsplash,
  knowledge_createKnowledge,
  knowledge_updateKnowledge,
  knowledge_searchKnowledge,
  deleting,
  setDeleting,
  knowledge_loading,
  ...rest
}) => {
  return (
    <Grid
      container
      style={{
        marginTop: "5em",
        backgroundImage: `url("/assets/game/hexagonTiles/webb.png")`,
        backgroundRepeat: "repeat",
        height: "100vh",
      }}
    >
      <Grid md={12} item>
        <PhysicsGameState>
          <PhysicsGame></PhysicsGame>
          {/* <Reality canvasId="3d" /> */}
        </PhysicsGameState>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles, { defaultTheme: theme })(World);
