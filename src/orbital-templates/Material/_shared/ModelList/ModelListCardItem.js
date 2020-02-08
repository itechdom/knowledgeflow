import React from "react";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { withState, compose } from "recompose";
import {
  Chip,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Divider,
  Grid
} from "@material-ui/core";

const enhance = compose(
  withState("actionOpen", "setActionOpen", false),
  withState("anchorEl", "setAnchorEl"),
  withState("fetchedImage", "setFetchedImage", []),
  withState("isLoading", "setIsLoading", false),
  withState("selectedImage", "setSelectedImage", 0)
);

const ModelListCardItem = ({
  classes,
  open,
  setOpen,
  model,
  updateModel,
  deleteModel,
  setDeletedModel,
  deletedModel,
  mode,
  match,
  history,
  onEdit,
  onView
}) => {
  return (
    <>
      <Card key={model._id} className={classes.card}>
        <CardActionArea
          onClick={() => {
            onView
              ? onView(model)
              : history.push(`${match.url}/view/${model._id}`);
          }}
        >
          <Grid container direction="column" justify="center">
            <CardContent>
              <Typography style={{ fontSize: "14px", fontWeight: "400" }}>
                {model.name || model.title}
              </Typography>
            </CardContent>
          </Grid>
        </CardActionArea>
        <CardActions>
          {model.tags &&
            model.tags.length > 0 &&
            model.tags.map((tag, index) => (
              <Chip
                key={index}
                size="small"
                variant="outlined"
                label={<>{tag}</>}
              />
            ))}
        </CardActions>
      </Card>
      <ConfirmDeleteModal
        open={open}
        setOpen={setOpen}
        onConfirm={() => {
          deleteModel(deletedModel).then(() => {
            setOpen(false);
          });
        }}
      />
    </>
  );
};

export default enhance(ModelListCardItem);
