import React from "react";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ConfirmDeleteModal from "../../orbital-templates/Material/_shared/ConfirmDeleteModal/ConfirmDeleteModal";
import ImageGallery from "react-image-gallery";
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
  Grid,
} from "@material-ui/core";

const enhance = compose(
  withState("actionOpen", "setActionOpen", false),
  withState("anchorEl", "setAnchorEl"),
  withState("fetchedImage", "setFetchedImage", []),
  withState("isLoading", "setIsLoading", false),
  withState("selectedImage", "setSelectedImage", 0)
);

class ModelListItem extends React.Component {
  fetchImages() {
    if (this.props.model) {
      const segments = this.props.model.title.split("-");
      const modelName =
        segments.length > 1
          ? segments[segments.length - 1]
          : this.props.model.title;
      this.props.getUnsplash &&
        this.props.getUnsplash(modelName.toLowerCase()).then((urls) => {
          this.props.setFetchedImage(urls);
        });
    }
  }
  componentDidMount() {
    this.fetchImages();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.page !== this.props.page) {
      this.fetchImages();
    }
  }
  renderImageGallery() {
    return (
      <ImageGallery
        startIndex={this.props.selectedImage}
        showFullscreenButton={false}
        showBullets={false}
        showPlayButton={false}
        showThumbnails={false}
        onSlide={(currentIndex) => {
          this.props.setSelectedImage(currentIndex);
        }}
        renderLeftNav={(onClick, disabled) => {
          return disabled ? (
            <></>
          ) : (
            <IconButton onClick={onClick}>
              <KeyboardArrowLeftIcon />
            </IconButton>
          );
        }}
        renderRightNav={(onClick, disabled) => {
          return disabled ? (
            <></>
          ) : (
            <IconButton onClick={onClick}>
              <KeyboardArrowRightIcon />
            </IconButton>
          );
        }}
        items={
          this.props.fetchedImage &&
          this.props.fetchedImage.map((url) => {
            return {
              original: url.small,
            };
          })
        }
      />
    );
  }
  render() {
    const {
      classes,
      open,
      setOpen,
      model,
      updateModel,
      deleteModel,
      setDeletedModel,
      deletedModel,
      match,
      history,
      onEdit,
      onView,
    } = this.props;
    return (
      <Grid style={{ marginBottom: "10em" }} container justify="center">
        <Grid item>
          <Card key={model._id} className={classes.card}>
            <CardActionArea
              onClick={() => {
                onView
                  ? onView(model)
                  : history.push(`${match.path}/view/${model._id}`);
              }}
            >
              <CardContent>
                <Typography variant="h5">
                  {model.name || model.title}
                </Typography>
              </CardContent>
              <Grid container>
                {this.props.fetchedImage &&
                this.props.fetchedImage.length > 0 ? (
                  <CardMedia
                    className={classes.cardImage}
                    component="img"
                    alt="Contemplative Reptile"
                    style={{ borderRadius: "150px", margin: "10px" }}
                    image={this.props.fetchedImage[0].small}
                    title="Contemplative Reptile"
                  />
                ) : (
                  <img
                    width="250px"
                    height="250px"
                    style={{ borderRadius: "150px", margin: "10px" }}
                    src="https://picsum.photos/500/500"
                  />
                )}
              </Grid>
            </CardActionArea>
            <CardActions>
              {model.tags.map((tag, index) => (
                <Chip
                  key={index}
                  size="small"
                  style={{ fontSize: "10px", marginRight: "3px" }}
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
        </Grid>
      </Grid>
    );
  }
}

export default enhance(ModelListItem);
