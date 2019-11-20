import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { ConfirmDeleteModal } from "Templates";
import { withState, compose } from "recompose";

import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Button
} from "@material-ui/core";

const enhance = compose(
  withState("actionOpen", "setActionOpen", false),
  withState("anchorEl", "setAnchorEl")
);

const ModelListItem = ({
  classes,
  open,
  setOpen,
  model,
  deleteModel,
  setDeletedModel,
  deletedModel,
  match,
  history,
  actionOpen,
  setActionOpen,
  anchorEl,
  setAnchorEl,
  onEdit,
  gridDisplay,
  onView
}) => {
  return (
    <>
      <ListItem className={classes.listItemContainer} key={model._id}>
        {model.image ? <Avatar src={`${model.image}`} /> : <Avatar />}
        <ListItemText>
          <Typography>{model.name || model.title}</Typography>
        </ListItemText>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={event => {
            setActionOpen(true);
            setAnchorEl(event.currentTarget);
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          open={actionOpen}
          id="fade-menu"
          keepMounted
          onClose={event => {
            setActionOpen(false);
            setAnchorEl(event.currentTarget);
          }}
          anchorEl={anchorEl}
        >
          <MenuItem
            onClick={() => {
              onEdit
                ? onView(model)
                : history.push(`${match.url}/view/${model._id}`);
            }}
          >
            <Button>view</Button>
          </MenuItem>
          <MenuItem>
            <IconButton
              onClick={() => {
                onEdit
                  ? onEdit(model)
                  : history.push(`${match.url}/edit/${model._id}`);
              }}
            >
              <EditIcon />
            </IconButton>
          </MenuItem>
          <MenuItem>
            <IconButton
              onClick={() => {
                setDeletedModel(model, () => {
                  setOpen(true);
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </MenuItem>
        </Menu>
      </ListItem>
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

export default enhance(ModelListItem);
