import React from "react";
import { styles } from "./Knowledge.styles.js";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import theme from "Theme";
import ModelList from "../orbital-templates/Material/_shared/ModelList/ModelList";
import ModelListItem from "./ModelList/ModelListItem";
import ModelPreview from "./ModelPreview/ModelPreview";
import { withStyles, Button } from "@material-ui/core";
const ModelListActions = ({ onAdd }) => {
  return (
    <Button
      key="close"
      aria-label="Edit Note"
      label="Edit Note"
      color="primary"
      onClick={onAdd}
    >
      <AddCircleIcon style={{ marginRight: "5px" }} />
      New Note
    </Button>
  );
};
const Knowledge = ({
  knowledge,
  knowledge_fetchModel,
  knowledge_createModel,
  knowledge_getModel,
  knowledge_updateModel,
  knowledge_deleteModel,
  knowledge_searchModel,
  knowledge_gallery_upload,
  knowledge_media_upload,
  knowledge_media_delete,
  knowledge_count,
  knowledge_setPage,
  knowledge_page,
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
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  match.path = "/";
  return (
    <ModelList
      modelArray={knowledge}
      disableDetailPages={true}
      modelKey={"title"}
      modelName={"knowledge"}
      columns={["title"]}
      createModel={(val) => {
        let group = "0";
        let size = 20;
        val.body = {
          "1": {
            title: val.title,
            id: "1",
            _id: "1",
            group,
            size,
            level: "0",
            attr: {},
            children: [],
            links: {
              title: val.title,
              target: "1",
              source: "1",
              group,
            },
          },
        };
        return knowledge_createModel(val);
      }}
      fetchModel={knowledge_fetchModel}
      updateModel={knowledge_updateModel}
      getModel={knowledge_getModel}
      deleteModel={knowledge_deleteModel}
      searchModel={knowledge_searchModel}
      uploadMedia={knowledge_media_upload}
      uploadGallery={knowledge_gallery_upload}
      deleteMedia={knowledge_media_delete}
      setFilter={knowledge_set_filter}
      removeFilter={knowledge_remove_filter}
      modelCount={knowledge_count}
      knowledgeSearch={knowledge_searchKnowledge}
      location={location}
      match={match}
      history={history}
      classes={classes}
      form={form}
      notifications={notifications}
      saveNotification={saveNotification}
      removeNotification={removeNotification}
      ModelPreviewPage={ModelPreview}
      ModelListItemComponent={ModelListItem}
      gridSizes={{ xl: 3, lg: 3, md: 3, sm: 12, xs: 12 }}
      ModelListActions={ModelListActions}
      justify={"center"}
      loading={knowledge_loading}
      getUnsplash={getUnsplash}
      onAdd={() => {
        history.push(`${match.path}/add`);
      }}
      onView={(model) => {
        history.push(`${match.path}knowledge/view/${model._id}`);
      }}
      page={knowledge_page}
      setPage={knowledge_setPage}
      enableSearch={true}
      onSearchSelect={(model) => {
        history.push(`${match.path}knowledge/view/${model._id}`);
      }}
      onChangePage={(page) => {
        knowledge_setPage(page);
        knowledge_fetchModel();
        history.push("/");
      }}
      {...rest}
    />
  );
};

export default withStyles(styles, { defaultTheme: theme })(Knowledge);
