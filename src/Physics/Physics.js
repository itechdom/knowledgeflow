import React from "react";
import { styles } from "./Physics.styles.js";
import theme from "Theme";
import Simulation from "./Simulation/Simulation";
import { withStyles, Button } from "@material-ui/core";
import { Game } from "../GameBoard/GameBoard";
import { GameState } from "../GameBoard/GameBoard.state";
import { Game as FighterGame } from "../GameFighter/GameFighter";
import { GameState as FighterGameState } from "../GameFighter/GameFighter.state";
import { Game as PuzzleGame } from "../GamePuzzles/GamePuzzles";
import { GameState as PuzzleGameState } from "../GamePuzzles/GamePuzzles.state";
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
      <Grid md={6} item>
        <GameState>
          <Game></Game>
        </GameState>
      </Grid>
      <Grid md={6} item>
        <FighterGameState>
          <FighterGame></FighterGame>
        </FighterGameState>
      </Grid>
      <Grid md={6} item>
        <PuzzleGameState>
          <PuzzleGame></PuzzleGame>
        </PuzzleGameState>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles, { defaultTheme: theme })(Physics);
