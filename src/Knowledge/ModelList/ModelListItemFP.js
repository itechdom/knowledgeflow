import React from "react";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ConfirmDeleteModal from "../../orbital-templates/Material/_shared/ConfirmDeleteModal/ConfirmDeleteModal";
import ImageGallery from "react-image-gallery";
import {
    Chip,
    Card,
    CardActionArea,
    CardContent,
    CardActions,
    CardMedia,
    Typography,
    IconButton,
    Grid
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
        <Grid style={{ marginBottom: "10em" }} container justify="center">

            <Grid item>
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
                                <CardMedia
                                    className={classes.cardImage}
                                    component="img"
                                    alt="Contemplative Reptile"
                                    style={{ borderRadius: "150px", margin: "10px" }}
                                    image={fetchedImage[0].small}
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
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                                {model.description}
                            </Typography>
                        </CardContent>
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
                    <ConfirmDeleteModal
                        open={open}
                        setOpen={setOpen}
                        onConfirm={() => {
                            deleteModel(deletedModel).then(() => {
                                setOpen(false);
                            });
                        }}
                    />
                </Card>
            </Grid>
        </Grid>
    );
};
export default ModelListItemFP;



