import React from "react";
import {
  ListItem,
  Icon,
  IconButton,
  Typography,
  Menu,
  MenuItem
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import StarRateIcon from "@material-ui/icons/StarRate";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import TextField from "../../orbital-templates/Material/_shared/Forms/Inputs/Forms.TextFieldInput";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { compose, withState } from "recompose";

const enhance = compose(
  withState("showNote", "setShowNote", false),
  withState("nodeValue", "setNodeValue", ""),
  withState("actionOpen", "setActionOpen", false),
  withState("anchorEl", "setAnchorEl")
);

class Node extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setNodeValue({ value: this.props.title, key: "title" });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.visible !== this.props.visible;
  }

  testHtml(title) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    return title && title.match(regex);
  }

  renderExpandCollapse() {
    if (this.props.hasChildren) {
      return this.props.visible ? (
        <IconButton onClick={this.props.handleNodeToggle}>
          <KeyboardArrowDownIcon />
        </IconButton>
      ) : (
        <IconButton onClick={this.props.handleNodeToggle}>
          <KeyboardArrowRightIcon />
        </IconButton>
      );
    }
    return (
      <IconButton onClick={this.props.handleNodeToggle}>
        <StarRateIcon />
      </IconButton>
    );
  }

  getTextStyle(isHighlighted, index) {
    return {
      margin: `10px 0px 10px ${this.props.level.split(".").length * 10}px`,
      borderBottom: "1px solid lightgrey",
      marginTop: isHighlighted ? "30px" : "0",
      fontWeight: isHighlighted ? "bold" : "",
      cursor: "pointer"
    };
  }
  renderActions() {
    const { actionOpen, setActionOpen, anchorEl, setAnchorEl } = this.props;
    return (
      <>
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
              this.props.handleNodeAdd("Empty Note ");
            }}
          >
            <IconButton>
              <AddCircleIcon />
            </IconButton>
          </MenuItem>
          <MenuItem>
            <IconButton
              onClick={() => {
                if (this.props.isEditing) {
                  return this.props.handleNodeUpdate(this.props.nodeValue);
                }
                this.props.handleNodeEdit();
              }}
            >
              {this.props.isEditing ? <CancelIcon /> : <EditIcon />}
            </IconButton>
          </MenuItem>
          <MenuItem>
            <IconButton
              onClick={() => {
                this.props.handleNodeDelete();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </MenuItem>
        </Menu>
      </>
    );
  }
  renderText() {
    if (!this.props.isEditing) {
      return this.testHtml(this.props.title) ? (
        <a target="_blank" href={this.props.title}>
          <Typography style={{ whiteSpace: "nowrap" }}>
            {this.props.title.length > 20 ? this.props.title : this.props.title}
          </Typography>
        </a>
      ) : (
        <Typography style={{ whiteSpace: "nowrap" }}>
          {this.props.title}
        </Typography>
      );
    }
    return (
      <TextField
        id={`input-${this.props._id}`}
        type="text"
        value={this.props.nodeValue.value}
        key={this.props.title}
        field={{ name: "title" }}
        setFieldValue={(key, value) => {
          this.props.setNodeValue({ key, value });
        }}
        setFieldTouched={(key, value) => {}}
        standAlone={true}
      />
    );
  }

  render() {
    const isHighlighted = this.props.level.length <= 6;
    return (
      <div key={this.props._id} ref={this.props.innerRef} id={this.props._id}>
        <ListItem
          className={"list-item"}
          style={{ ...this.getTextStyle(isHighlighted, this.props.index) }}
        >
          {this.renderExpandCollapse()}
          {this.renderText()}
          <IconButton
            onClick={() => {
              if (this.props.isEditing) {
                this.props.handleNodeUpdate(this.props.nodeValue);
              }
              this.props.handleNodeEdit();
            }}
          >
            {this.props.isEditing ? <CancelIcon /> : <EditIcon />}
          </IconButton>
          {this.props.note && (
            <IconButton
              onClick={() => {
                this.props.setShowNote(prevState => {
                  return !prevState;
                });
              }}
            >
              <Icon>note</Icon>
            </IconButton>
          )}
          {this.renderActions()}
        </ListItem>
      </div>
    );
  }
}
const EnhancedNode = enhance(Node);
const NodeWithRef = React.forwardRef((props, ref) => {
  return <EnhancedNode innerRef={ref} {...props} />;
});
export default NodeWithRef;
