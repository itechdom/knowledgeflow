import React from "react";
import {
  Button,
  Grid,
  Paper,
  CircularProgress,
  Toolbar,
  AppBar,
  List,
  ListItem,
  IconButton,
  Icon,
  Tabs,
  Tab
} from "@material-ui/core";
import Reveal from "./Reveal";
import Autocomplete from "../../orbital-templates/Material/_shared/Autocomplete/Autocomplete";
import ListTree from "./ListTree.js";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmDeleteModal from "../../orbital-templates/Material/_shared/ConfirmDeleteModal/ConfirmDeleteModal";
import GraphTree from "./GraphTree";
import { withState, compose } from "recompose";
import {
  handleNodeAdd,
  handleNodeDelete,
  handleNodeEdit,
  handleNodeSave,
  handleNodeSwap,
  handleNodeToggle,
  handleNodeUpdate,
  isVisible
} from "./Model.Preview.state";

const enhance = compose(
  withState("edit", "setEdit", false),
  withState("level", "setLevel", 0),
  withState("editedNode", "setEditedNode", ""),
  withState("mindmapByKeys", "setMindmapByKeys"),
  withState("viewOption", "setViewOption", 0),
  withState("deleting", "setDeleting", false),
  withState("references", "setReferences"),
  withState("graphContainer", "setGraphContainer"),
  withState("listContainer", "setListContainer")
);
const ExpandCollapse = props => {
  const { handleNodeToggle, visible } = props;
  return visible ? (
    <IconButton onClick={handleNodeToggle}>
      <Icon>keyboard_arrow_down</Icon>
    </IconButton>
  ) : (
    <IconButton onClick={handleNodeToggle}>
      <Icon>keyboard_arrow_right</Icon>
    </IconButton>
  );
};
const ModelPreviewViewOption = ({ viewOption, setViewOption, classes }) => {
  return (
    <Grid
      className={classes.viewOptionContainer}
      container
      justify={"flex-end"}
    >
      {/* <Grid item>
        <Paper>
          <Button
            className={
              viewOption === 0 ? classes.viewOptionSelected : classes.viewOption
            }
            onClick={() => setViewOption(0)}
          >
            Graph
          </Button>
        </Paper>
      </Grid>

      <Grid item>
        <Paper>
          <Button
            className={
              viewOption === 1 ? classes.viewOptionSelected : classes.viewOption
            }
            onClick={() => setViewOption(1)}
          >
            List
          </Button>
        </Paper>
      </Grid> */}
    </Grid>
  );
};

const graphRefCallback = (graphConainer, setGraphContainer, ref) => {
  if (ref) {
    setGraphContainer(ref.getBoundingClientRect());
  }
};

const listRefCallback = (listConainer, setListContainer, ref) => {
  if (ref) {
    setListContainer(ref);
  }
};

const ModelPreview = props => {
  let {
    model,
    edit,
    setEdit,
    editedNode,
    setEditedNode,
    visibleNodeKeys,
    setVisibleNodeByKeys,
    mindmapByKeys,
    setMindmapByKeys,
    level,
    setLevel,
    updateModel,
    createModel,
    searchModel,
    deleteModel,
    knowledgeSearch,
    viewOption,
    setViewOption,
    graphData,
    setGraphData,
    classes,
    deleting,
    setDeleting,
    references,
    setReferences,
    graphContainer,
    setGraphContainer,
    listContainer,
    setListContainer,
    onAdd,
    onEdit,
    onDelete,
    onCreate,
    onView,
    ...rest
  } = props;
  const [wikipedia, setWikipedia] = React.useState();
  const [wikipediaVisible, setWikipediaVisible] = React.useState(false);
  React.useEffect(() => {
    model &&
      props.fetchPageByTopic &&
      props.fetchPageByTopic(model.title).then(data => {
        setWikipedia(data);
      });
    model &&
      props.fetchImagesByTopic &&
      props.fetchImagesByTopic(model.title).then(data => {
        console.log("data", data);
      });
  }, []);
  if (!mindmapByKeys && model && model.body) {
    setMindmapByKeys(model.body);
  }
  const measure = {
    graphRefCallback: graphRefCallback.bind(
      null,
      graphContainer,
      setGraphContainer
    ),
    listRefCallback: listRefCallback.bind(null, listContainer, setListContainer)
  };
  const TreeOperations = {
    handleNodeAdd: handleNodeAdd.bind(null, mindmapByKeys, setMindmapByKeys),
    handleNodeEdit: handleNodeEdit.bind(null, mindmapByKeys, setEditedNode),
    handleNodeUpdate: handleNodeUpdate.bind(
      null,
      mindmapByKeys,
      setMindmapByKeys,
      setEditedNode,
      updateModel,
      model
    ),
    handleNodeToggle: handleNodeToggle.bind(
      null,
      mindmapByKeys,
      setMindmapByKeys
    ),
    handleNodeDelete: handleNodeDelete.bind(
      null,
      mindmapByKeys,
      setMindmapByKeys
    ),
    isVisible: isVisible.bind(null, mindmapByKeys, visibleNodeKeys)
  };
  const listTreeSizes = {
    xs: viewOption === 1 ? 12 : 12,
    sm: viewOption === 1 ? 12 : 12,
    md: viewOption === 1 ? 12 : 4,
    lg: viewOption === 1 ? 12 : 4,
    xl: viewOption === 1 ? 12 : 4
  };
  const graphTreeSizes = {
    xs: viewOption === 0 ? 12 : 12,
    sm: viewOption === 0 ? 12 : 12,
    md: viewOption === 0 ? 8 : 1,
    lg: viewOption === 0 ? 8 : 1,
    xl: viewOption === 0 ? 8 : 1
  };

  return (
    <>
      <header>
        <AppBar
          className={classes.autocompleteContainer}
          position="static"
          color="default"
        >
          <Toolbar>
            <Autocomplete
              inputClassName={classes.autocomplete}
              throttleSearch={true}
              placeholder={"Search…"}
              onSelect={suggestion => {
                window.setTimeout(() => {
                  if (
                    references[suggestion.id] &&
                    references[suggestion.id].current
                  ) {
                    const elOffset =
                      references[suggestion.id].current.offsetTop;
                    listContainer.scrollTop = elOffset;
                  }
                }, 1000);
                TreeOperations.handleNodeToggle(suggestion.id);
              }}
              loadSuggestions={text => {
                return new Promise((resolve, reject) => {
                  const res = knowledgeSearch(mindmapByKeys, text);
                  res && resolve(res);
                });
              }}
            />
          </Toolbar>
        </AppBar>
      </header>
      {model && (
        <Toolbar>
          <Grid container justify="flex-end">
            <Button
              variant="contained"
              aria-label="Edit Note"
              label="Edit Note"
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={() => onEdit(model)}
            >
              <EditIcon style={{ marginRight: "5px" }} />
            </Button>
            <Button
              variant="contained"
              aria-label="Edit Note"
              label="Edit Note"
              color="secondary"
              onClick={() => setDeleting(true)}
            >
              <DeleteIcon style={{ marginRight: "5px" }} />
            </Button>
          </Grid>
        </Toolbar>
      )}
      <ConfirmDeleteModal
        open={deleting}
        setOpen={setDeleting}
        onConfirm={() => {
          setDeleting(false);
          deleteModel(model).then(res => {
            onDelete();
          });
        }}
      />
      <ModelPreviewViewOption
        viewOption={viewOption}
        setViewOption={setViewOption}
        classes={classes}
      />
      {mindmapByKeys && (
        <Grid container>
          <Grid {...listTreeSizes} item>
            <Paper>
              <div
                ref={ref => {
                  if (!listContainer) {
                    measure.listRefCallback(ref);
                  }
                }}
                style={{ height: "500px", overflow: "scroll" }}
              >
                <List>
                  <ListItem>
                    <ExpandCollapse
                      handleNodeToggle={() =>
                        setWikipediaVisible(!wikipediaVisible)
                      }
                      visible={wikipediaVisible}
                    />
                    <h1>Wikipedia</h1>
                    {wikipediaVisible ? (
                      <div>
                        <Reveal Node={wikipedia} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </ListItem>
                </List>
                <ListTree
                  mindmapByKeys={mindmapByKeys}
                  editedNode={editedNode}
                  edit={edit}
                  level={level}
                  onRefs={references => {
                    setReferences(references);
                  }}
                  {...TreeOperations}
                />
              </div>
            </Paper>
          </Grid>
          <Grid {...graphTreeSizes} item>
            <Paper>
              <div
                ref={ref => {
                  if (!graphContainer) {
                    measure.graphRefCallback(ref);
                  }
                }}
              >
                <GraphTree
                  mindmapByKeys={mindmapByKeys}
                  editedNode={editedNode}
                  edit={edit}
                  level={level}
                  width={graphContainer && graphContainer.width}
                  height={graphContainer && graphContainer.height}
                  {...TreeOperations}
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
      )}
      {!mindmapByKeys && (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      )}
    </>
  );
};

export default enhance(ModelPreview);
