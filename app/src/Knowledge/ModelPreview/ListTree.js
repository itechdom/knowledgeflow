import React from "react";
import { List } from "@material-ui/core";
import Node from "./Node";
class ListTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: {}
    };
    this.references = {};
    Object.keys(this.props.mindmapByKeys).map(nodeId => {
      this.references[nodeId] = React.createRef();
    });
    this.props.onRefs(this.references);
  }
  renderNode(nodeId, index, parent) {
    const { mindmapByKeys } = this.props;
    const TreeOperations = {
      handleNodeAdd: this.props.handleNodeAdd.bind(null, nodeId),
      handleNodeEdit: this.props.handleNodeEdit.bind(null, nodeId),
      handleNodeUpdate: this.props.handleNodeUpdate.bind(null, nodeId),
      handleNodeToggle: this.props.handleNodeToggle.bind(null, nodeId),
      handleNodeDelete: this.props.handleNodeDelete.bind(null, nodeId)
    };
    return (
      <div key={nodeId}>
        <Node
          _id={nodeId}
          index={index}
          title={mindmapByKeys[nodeId] && mindmapByKeys[nodeId].title}
          level={mindmapByKeys[nodeId] && mindmapByKeys[nodeId].level}
          visible={mindmapByKeys[nodeId].visible}
          parent={parent}
          ref={this.references && this.references[nodeId]}
          note={
            mindmapByKeys[nodeId].attr &&
            mindmapByKeys[nodeId].attr.note &&
            mindmapByKeys[nodeId].attr.note.text
          }
          hasChildren={
            mindmapByKeys[nodeId].children &&
            mindmapByKeys[nodeId].children.length > 0
          }
          isEditing={this.props.editedNode === nodeId}
          {...TreeOperations}
        />
        {mindmapByKeys[nodeId].visible &&
          mindmapByKeys[nodeId].children &&
          mindmapByKeys[nodeId].children.length > 0 && (
            <ul style={{ borderLeft: `1px solid lightgrey` }}>
              {mindmapByKeys[nodeId].children.map((_id, index) => {
                return this.renderNode(_id, index, mindmapByKeys[nodeId]);
              })}
            </ul>
          )}
      </div>
    );
  }

  render() {
    const root = Object.keys(this.props.mindmapByKeys)[0];
    return (
      <>
        {root && (
          <List>
            {this.renderNode(root, 0, this.props.mindmapByKeys[root])}
          </List>
        )}
      </>
    );
  }
}
export default ListTree;
