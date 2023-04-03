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

const ModelListItemFP = ({
    classes,
    model,
    updateModel,
    deleteModel,
    setDeletedModel,
    deletedModel,
    match,
    history,
    onEdit,
    onView,
    getUnsplash,
    page,
    setPage,
}) => {
    const [open, setOpen] = React.useState(false);
    //useState for selectedImage and setSelectedImage
    const [selectedImage, setSelectedImage] = React.useState(0);
    //useState for fetchedImage and setFetchedImage
    const [fetchedImage, setFetchedImage] = React.useState([]);
    //useState for isLoading and setIsLoading
    const [isLoading, setIsLoading] = React.useState(false);
    //useState for actionOpen and setActionOpen
    const [actionOpen, setActionOpen] = React.useState(false);
    //useState for anchorEl and setAnchorEl
    const [anchorEl, setAnchorEl] = React.useState(null);
    //useState for setDeletedModel and deletedModel
    const [deletedModel, setDeletedModel] = React.useState(null);
    const fetchImages = () => {
        if (model) {
            const segments = model.title.split("-");
            const modelName =
                segments.length > 1 ? segments[segments.length - 1] : model.title;
            getUnsplash && getUnsplash(modelName.toLowerCase()).then((urls) => {
                setFetchedImage(urls);
            });
        }
    };
    React.useEffect(() => {
        fetchImages();
    }, [page]);
    const renderImageGallery = () => {
        return (
            <ImageGallery
                startIndex={selectedImage}
                showFullscreenButton={false}
                showBullets={false}
                showPlayButton={false}
                showThumbnails={false}
                onSlide={(currentIndex) => {
                    setSelectedImage(currentIndex);
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
                items={fetchedImage.map((url) => {
                    return {
                        original: url,
                        thumbnail: url,
                    };
                })}
            />
        );
    };
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card className={classes.card}>
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
                        {fetchedImage && fetchedImage.length > 0 ? (
                            <Grid item xs={12}>
                                {renderImageGallery()}
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <CardMedia
                                    className={classes.media}
                                    image={model.image}
                                    title={model.name || model.title}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <CardContent>
                        <Typography variant="body2" color="textSecondary">
                            {model.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => {
                            setAnchorEl(event.currentTarget);
                            setActionOpen(true);
                        }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={actionOpen}
                        onClose={() => {
                            setActionOpen(false);
                        }}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: "20ch",
                            },
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                setActionOpen(false);
                                onEdit
                                    ? onEdit(model)
                                    : history.push(
                                        `${match.path}/edit/${model._id}`
                                    );
                            }}
                        >
                            Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setActionOpen(false);
                                setDeletedModel(model);
                                setOpen(true);
                            }}
                        >
                            Delete
                        </MenuItem>
                    </Menu>
                </CardActions>
            </Card>
        </Grid>
    );
};
export default enhance(ModelListItemFP);



