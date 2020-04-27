import React from "react";
import { styles } from "./Physics.styles.js";
import theme from "Theme";
import Simulation from "./Simulation/Simulation";
// import Math from "../Math/Math";
import { withStyles, Button } from "@material-ui/core";
import { Game, GameState } from "../BoardGame/BoardGame";

const Physics = ({
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
    <div
      style={{
        marginTop: "5em",
        backgroundImage: `url("/assets/game/hexagonTiles/webb.png")`,
        backgroundRepeat: "repeat",
        height: "100vh",
      }}
    >
      {/* <Simulation /> */}
      <GameState>
        <Game></Game>
      </GameState>
    </div>
  );
};

export default withStyles(styles, { defaultTheme: theme })(Physics);
