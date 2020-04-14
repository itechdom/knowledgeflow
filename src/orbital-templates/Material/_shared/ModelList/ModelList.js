import React from "react";
//Routing
import { Route, Switch, HashRouter as Router } from "react-router-dom";
import { styles } from "./ModelList.styles";
import { withStyles } from "@material-ui/core/styles";
//recompose
import { withState, compose, lifecycle } from "recompose";
//Different template pages
import ModelAdd from "../ModelAdd/ModelAdd";
import ModelEdit from "../ModelEdit/ModelEdit";
import ModelPreview from "../ModelPreview/ModelPreview";
import ModelListItems from "./ModelListItems";
import ModelFilterList from "./ModelFilterList";
//shared components
import theme from "../../../../theme";
import {
  Grid,
  Fade,
  Card,
  CardContent,
  Button,
  IconButton,
  Icon,
  Paper,
  Backdrop,
  useMediaQuery,
} from "@material-ui/core";
import Pagination from "../Pagination/Pagination";
import Autocomplete from "../Autocomplete/Autocomplete";
import FloatingAddButton from "../FloatingAddButton/FloatingAddButton";
import ClientNotification from "../ClientNotification/ClientNotification";
import Loading from "../Loading/Loading";

const enhance = compose(withState("viewOption", "setViewOption", 0));

const ModelList = enhance(
  ({
    modelArray,
    modelSchema,
    columns,
    createModel,
    modelName,
    fetchModel,
    updateModel,
    deleteModel,
    searchModel,
    uploadMedia,
    setFilter,
    removeFilter,
    modelCount,
    loading,
    gallery,
    uploadGallery,
    addToGallery,
    removeFromGallery,
    addToMedia,
    removeFromMedia,
    deleteMedia,
    media,
    mode,
    match,
    history,
    classes,
    form,
    notifications,
    saveNotification,
    removeNotification,
    ModelListPage,
    ModelEditPage,
    ModelAddPage,
    ModelPreviewPage,
    ModelPreviewAction,
    ModelPreviewActions,
    ModelPreviewAttachment,
    modelKey,
    columnNumber,
    xs,
    sm,
    md,
    lg,
    xl,
    onSearch,
    onSearchSelect,
    viewOption,
    setViewOption,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    ModelListActions,
    ModelListItemComponent,
    noPagination,
    onChangePage,
    onAdd,
    onAddText,
    onDelete,
    onEdit,
    onEditSubmit,
    onCreate,
    onCreateSubmit,
    onView,
    onSubmit,
    defaultView,
    gridSizes,
    disableViewPage,
    disableEditPage,
    enableSearch,
    justify,
    ...rest
  }) => {
    const onEditWrapper = (model) => {
      if (onEdit) {
        return onEdit(model);
      }
      history.push(`${match.path}/edit/${model._id}`);
    };
    const onDeleteWrapper = (model) => {
      if (onDelete) {
        return onDelete(model);
      }
      history.push(`${match.path}`);
    };
    const onAddWrapper = () => {
      if (onAdd) {
        return onAdd();
      }
      history.push(`${match.path}/add`);
    };
    const onCreateWrapper = (model) => {
      if (onCreate) {
        return onCreate(model);
      }
      model && onViewWrapper(model);
    };
    const onViewWrapper = (model) => {
      if (onView) {
        return onView(model);
      }
      history.push(`${match.path}/view/${model._id}`);
    };
    const isXS = useMediaQuery((theme) => theme.breakpoints.down("xs"));
    const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const isBig = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const Actions = {
      onEdit: onEditWrapper,
      onDelete: onDeleteWrapper,
      onCreate: onCreateWrapper,
      onView: onViewWrapper,
      onAdd: onAddWrapper,
    };
    let models = modelArray.data;
    return (
      <Router>
        <Switch>
          <Route
            path={`${match.path}/add`}
            render={(props) => {
              return ModelAddPage ? (
                <Grid container justify="center">
                  <Grid item xs={12}>
                    <ModelAddPage
                      model={{}}
                      form={form}
                      modelSchema={modelSchema}
                      onSave={(values) => {
                        createModel(values).then((model) => {
                          onCreateSubmit && onCreateSubmit(model);
                        });
                      }}
                      onCancel={() => {
                        history.goBack();
                      }}
                      modelName={modelName}
                      location={location}
                      match={match}
                      history={history}
                      {...rest}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Fade timeout={1000} in={!loading}>
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <ModelAdd
                        model={{}}
                        form={form}
                        modelSchema={modelSchema}
                        onSave={(values) => {
                          createModel(values).then((model) => {
                            onCreateSubmit
                              ? onCreateSubmit(model)
                              : history.push(`${match.path}/view/${model._id}`);
                          });
                        }}
                        onCancel={() => {
                          history.goBack();
                        }}
                        modelName={modelName}
                        location={location}
                        match={match}
                        history={history}
                        notifications={notifications}
                        removeNotification={removeNotification}
                        {...rest}
                      />
                    </Grid>
                  </Grid>
                </Fade>
              );
            }}
          />

          {!disableEditPage && (
            <Route
              path={`${match.path}/edit/:id`}
              render={(props) => {
                return ModelEditPage ? (
                  <Grid container justify="center">
                    <Grid xs={12}>
                      <ModelEditPage
                        modelName={modelName}
                        onCancel={() => {
                          history.goBack();
                        }}
                        onSave={(updatedModel, values) => {
                          updateModel(updatedModel, values).then((res) => {
                            onEditSubmit && onEditSubmit(updatedModel);
                          });
                        }}
                        form={form}
                        modelSchema={modelSchema}
                        model={
                          models &&
                          models.length > 0 &&
                          models.find(
                            ({ _id }) => _id === props.match.params.id
                          )
                        }
                        media={media}
                        gallery={
                          gallery &&
                          gallery.length > 0 &&
                          gallery.filter(
                            ({ modelId }) => modelId === props.match.params.id
                          )
                        }
                        uploadMedia={uploadMedia}
                        uploadGallery={uploadGallery}
                        addToGallery={addToGallery}
                        removeFromGallery={removeFromGallery}
                        addToMedia={addToMedia}
                        deleteMedia={deleteMedia}
                        removeFromMedia={removeFromMedia}
                        onMediaUploadComplete={(model, media) => {
                          updateModel(model, {
                            image: `${media}&q=${Date.now()}`,
                          });
                        }}
                        onGalleryUploadComplete={(model, media) => {
                          updateModel(model, {
                            gallery: [...model.gallery, ...media],
                          });
                        }}
                        onMediaDeleteComplete={(model, media) => {
                          updateModel(model, { image: `` });
                        }}
                        onGalleryDeleteComplete={(model, index) => {
                          model.gallery.remove(index);
                          updateModel(model, { gallery: model.gallery });
                        }}
                        match={match}
                        deleteModel={deleteModel}
                        {...rest}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Fade timeout={1000} in={!loading}>
                    <Grid container justify="center">
                      <Grid xs={12}>
                        <ModelEdit
                          modelName={modelName}
                          onCancel={() => {
                            history.goBack();
                          }}
                          onSave={(updatedModel, values) => {
                            updateModel(updatedModel, values).then((res) => {
                              onEditSubmit && onEditSubmit(updatedModel);
                            });
                          }}
                          form={form}
                          modelSchema={modelSchema}
                          model={
                            models &&
                            models.length > 0 &&
                            models.find(
                              ({ _id }) => _id === props.match.params.id
                            )
                          }
                          media={media}
                          gallery={
                            gallery &&
                            gallery.length > 0 &&
                            gallery.filter(
                              ({ modelId }) => modelId === props.match.params.id
                            )
                          }
                          uploadMedia={uploadMedia}
                          uploadGallery={uploadGallery}
                          addToGallery={addToGallery}
                          removeFromGallery={removeFromGallery}
                          addToMedia={addToMedia}
                          deleteMedia={deleteMedia}
                          removeFromMedia={removeFromMedia}
                          onMediaUploadComplete={(model, media) => {
                            updateModel(model, {
                              image: `${media}&q=${Date.now()}`,
                            });
                          }}
                          onGalleryUploadComplete={(model, media) => {
                            updateModel(model, {
                              gallery: [...model.gallery, ...media],
                            });
                          }}
                          onMediaDeleteComplete={(model, media) => {
                            updateModel(model, { image: `` });
                          }}
                          onGalleryDeleteComplete={(model, index) => {
                            model.gallery.remove(index);
                            updateModel(model, { gallery: model.gallery });
                          }}
                          notifications={notifications}
                          removeNotification={removeNotification}
                          {...rest}
                        />
                      </Grid>
                    </Grid>
                  </Fade>
                );
              }}
            />
          )}
          {!disableViewPage && (
            <Route
              path={`${match.path}/view/:id`}
              render={(props) => {
                let model =
                  models &&
                  models.length > 0 &&
                  models.find(({ _id }) => _id === props.match.params.id);
                if (!model) {
                  return <Loading></Loading>;
                }
                return ModelPreviewPage ? (
                  <Grid container>
                    <Grid item xs={12}>
                      <ModelPreviewPage
                        modelName={modelName}
                        onEdit={onEditWrapper}
                        onDelete={onDeleteWrapper}
                        deleteModel={deleteModel}
                        updateModel={updateModel}
                        searchModel={searchModel}
                        form={form}
                        model={model}
                        classes={classes}
                        match={props.match}
                        location={location}
                        history={history}
                        ModelPreviewActions={ModelPreviewActions}
                        ModelPreviewAction={ModelPreviewAction}
                        {...rest}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  // <Fade timeout={1000} in={!loading}>
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ModelPreview
                        modelName={modelName}
                        onEdit={onEditWrapper}
                        onDelete={onDeleteWrapper}
                        deleteModel={deleteModel}
                        updateModel={updateModel}
                        searchModel={searchModel}
                        form={form}
                        classes={classes}
                        model={model}
                        ModelPreviewActions={ModelPreviewActions}
                        ModelPreviewAction={ModelPreviewAction}
                        notifications={notifications}
                        removeNotification={removeNotification}
                        {...rest}
                      />
                      {ModelPreviewAttachment && (
                        <ModelPreviewAttachment model={model} />
                      )}
                      <FloatingAddButton onClick={onAddWrapper} />
                    </Grid>
                  </Grid>
                  // </Fade>
                );
              }}
            />
          )}
          <Route
            path={`${match.path}`}
            render={(props) => {
              return (
                <>
                  <Backdrop
                    style={{
                      zIndex: 99,
                      color: "#fff",
                    }}
                    open={loading}
                  >
                    <Loading></Loading>
                  </Backdrop>
                  {enableSearch && (
                    <Grid
                      style={{ marginBottom: "1em" }}
                      container
                      justify="flex-end"
                    >
                      <Grid item xs={12}>
                        <Paper style={{ padding: "1em", borderRadius: "50px" }}>
                          <Autocomplete
                            inputClassName={classes.autocomplete}
                            placeholder={"Search…"}
                            onSelect={(suggestion) => {
                              onSearchSelect || disableViewPage
                                ? onSearchSelect(suggestion)
                                : history.push(
                                    `${match.path}/view/${suggestion._id}`
                                  );
                            }}
                            loadSuggestions={(text) => {
                              let query = {
                                [modelKey]: { $regex: text },
                              };
                              if (onSearch) {
                                return onSearch(query);
                              }
                              return new Promise((resolve, reject) => {
                                searchModel(query).then((res) => {
                                  console.log("RESULT", res);
                                  return resolve(res.data);
                                });
                              });
                            }}
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  )}
                  {(ModelListActions && <ModelListActions {...Actions} />) || (
                    <Button
                      color="secondary"
                      classes={classes.addButton}
                      onClick={onAddWrapper}
                      variant="contained"
                    >
                      {onAddText ? onAddText : `Create ${modelName}`}
                    </Button>
                  )}
                  {viewOption === 0 && (
                    <Grid container justify={justify}>
                      {modelCount && (
                        <ModelFilterList form={form} modelCount={modelCount} />
                      )}
                      <Grid item md={12}>
                        {defaultView ? (
                          defaultView
                        ) : (
                          <Grid container justify={justify}>
                            <ModelListItems
                              models={models}
                              classes={classes}
                              gridSizes={gridSizes}
                              ModelListItemComponent={ModelListItemComponent}
                              deleteModel={deleteModel}
                              updateModel={updateModel}
                              columnNumber={columnNumber}
                              page={page}
                              history={history}
                              match={match}
                              onView={onViewWrapper}
                              onEdit={onEditWrapper}
                              loading={loading}
                              mode={mode}
                            />
                          </Grid>
                        )}
                      </Grid>
                      <Grid container>
                        <Grid style={{ marginTop: "4em" }} item md={12}>
                          {!noPagination ? (
                            <Paper>
                              <Pagination
                                isSm={isSm}
                                component="div"
                                count={modelArray.count}
                                rowsPerPage={10}
                                page={page}
                                onChangePage={(p) => {
                                  onChangePage(p);
                                }}
                              />
                            </Paper>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  <ClientNotification
                    notifications={notifications}
                    handleClose={(event, reason, notification) => {
                      removeNotification(notification);
                    }}
                  />
                  <FloatingAddButton onClick={onAddWrapper} />
                </>
              );
            }}
          />
        </Switch>
      </Router>
    );
  }
);

export default withStyles(styles, { defaultTheme: theme })(ModelList);
