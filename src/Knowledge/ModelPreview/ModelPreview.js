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
  Tab,
  Typography,
} from "@material-ui/core";
import Autocomplete from "../../orbital-templates/Material/_shared/Autocomplete/Autocomplete";
import Markdown from "../../orbital-templates/Material/_shared/Forms/Inputs/Forms.MarkdownInput";
import ListTree from "./ListTree.js";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmDeleteModal from "../../orbital-templates/Material/_shared/ConfirmDeleteModal/ConfirmDeleteModal";
import GraphTree from "./GraphTree";
import Mindmap from "./Mindmap";
import { withState, compose } from "recompose";
import {
  handleNodeAdd,
  handleNodeDelete,
  handleNodeEdit,
  handleNodeSave,
  handleNodeSwap,
  handleNodeToggle,
  handleNodeUpdate,
  isVisible,
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
const ExpandCollapse = (props) => {
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

const store = {};

const ModelPreview = (props) => {
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
    wikipedia,
    ...rest
  } = props;
  React.useEffect(() => {
    props.fetchPageByTopic && props.fetchPageByTopic(model.title);
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
    listRefCallback: listRefCallback.bind(
      null,
      listContainer,
      setListContainer
    ),
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
    isVisible: isVisible.bind(null, mindmapByKeys, visibleNodeKeys),
  };
  const listTreeSizes = {
    xs: viewOption === 1 ? 12 : 12,
    sm: viewOption === 1 ? 12 : 12,
    md: viewOption === 1 ? 12 : 12,
    lg: viewOption === 1 ? 12 : 12,
    xl: viewOption === 1 ? 12 : 12,
  };
  const graphTreeSizes = {
    xs: viewOption === 0 ? 12 : 12,
    sm: viewOption === 0 ? 12 : 12,
    md: viewOption === 0 ? 5 : 1,
    lg: viewOption === 0 ? 5 : 1,
    xl: viewOption === 0 ? 5 : 1,
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
              onSelect={(suggestion) => {
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
              loadSuggestions={(text) => {
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
          deleteModel(model).then((res) => {
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
        <Grid container justify="space-between">
          <Grid
            style={{
              marginBottom: "6em",
            }}
            {...listTreeSizes}
            item
          >
            <Paper
              style={{
                height: "400px",
                overflow: "scroll",
              }}
            >
              <div
                ref={(ref) => {
                  if (!listContainer) {
                    measure.listRefCallback(ref);
                  }
                }}
              >
                <ListTree
                  mindmapByKeys={mindmapByKeys}
                  editedNode={editedNode}
                  edit={edit}
                  level={level}
                  onRefs={(references) => {
                    setReferences(references);
                  }}
                  {...TreeOperations}
                />
              </div>
            </Paper>
          </Grid>
          <Grid {...graphTreeSizes} item>
            <Grid container justify="center" style={{ marginBottom: "10px" }}>
              <Grid item md={4}>
                <Typography variant="h5" style={{ fontWeight: "300" }}>
                  Force Directed Graph
                </Typography>
              </Grid>
            </Grid>
            <Paper>
              <div
                ref={(ref) => {
                  if (!graphContainer) {
                    measure.graphRefCallback(ref);
                  }
                }}
              >
                {/* <Mindmap
                  mindmapByKeys={mindmapByKeys}
                  editedNode={editedNode}
                  edit={edit}
                  level={level}
                  width={graphContainer && graphContainer.width}
                  height={graphContainer && graphContainer.height}
                  {...TreeOperations}
                ></Mindmap> */}
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
          <Grid {...graphTreeSizes} item>
            <Grid item>
              <Grid container justify="center" style={{ marginBottom: "10px" }}>
                <Grid item md={4}>
                  <Typography variant="h5" style={{ fontWeight: "300" }}>
                    Wikipedia
                  </Typography>
                </Grid>
              </Grid>
              <Paper>
                <List>
                  {wikipedia.map((link) => (
                    <ListItem>
                      <a target="_blank" href={link}>
                        <Typography style={{ whiteSpace: "nowrap" }}>
                          {link}
                        </Typography>
                      </a>
                    </ListItem>
                  ))}
                </List>
                {/* <List>
                  {wikipediaImages.map((image) => (
                    <ListItem>
                      <a target="_blank" href={image}>
                        <img src={image} />
                      </a>
                    </ListItem>
                  ))}
                </List> */}
              </Paper>
            </Grid>
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
