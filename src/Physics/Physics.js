import React from "react";
import { styles } from "./Physics.styles.js";
import theme from "Theme";
// import Simulation from "./Simulation/Simulation";
import { withStyles, Button } from "@material-ui/core";
// import ThreeSim from "./Simulation/Simulation";
import { Game } from "../GameBoard/GameBoard";
import { GameState } from "../GameBoard/GameBoard.state";
import { GameState as PuzzleGameState } from "../GamePuzzles/GamePuzzles.state";
import { Game as PhysicsGame } from "../GamePhysics/GamePhysics";
import { GameState as PhysicsGameState } from "../GamePhysics/GamePhysics.state";
import { Grid } from "@material-ui/core";

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
    <Grid
      container
      style={{
        marginTop: "5em",
        backgroundImage: `url("/assets/game/hexagonTiles/webb.png")`,
        backgroundRepeat: "repeat",
        height: "100vh",
      }}
    >
      {/* <Grid md={12} item>
        <GameState>
          <PuzzleGameState knowledge={knowledge}>
            <Game></Game>
          </PuzzleGameState>
        </GameState>
      </Grid> */}
      {/* <Grid md={6} item>
        <FighterGameState>
          <FighterGame></FighterGame>
        </FighterGameState>
      </Grid>
      <Grid md={6} item>
        <PuzzleGameState>
          <PuzzleGame></PuzzleGame>
        </PuzzleGameState>
      </Grid> */}
      <Grid md={12} item>
        <PhysicsGameState>
          <PhysicsGame></PhysicsGame>
        </PhysicsGameState>
      </Grid>
      {/* <Grid md={12} item>
        <ThreeSim></ThreeSim>
      </Grid> */}
    </Grid>
  );
};

export default withStyles(styles, { defaultTheme: theme })(Physics);
