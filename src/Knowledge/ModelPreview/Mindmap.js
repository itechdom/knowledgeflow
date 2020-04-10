import { List, Paper, Grid } from "@material-ui/core";
import React from "react";
import MindmapTree from "react-d3-tree";
import Node from "./Node";
import { TransitionGroup, Transition } from "react-transition-group";

export const convertToMindmap = (node, mindmapByKeys) => {
  const keyList = Object.keys(node);
  console.log("KEY LIST", keyList);
  keyList.map((key) => {
    const currentNode = mindmapByKeys[key];
    console.log(key, "CURRENTNODE", currentNode);
    currentNode.name = currentNode.title;
    currentNode._collapsed = false;
    currentNode.children =
      currentNode.children &&
      currentNode.children.map((key) => {
        return mindmapByKeys[key];
      });
    return convertToMindmap(currentNode.children, mindmapByKeys);
  });
};
class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  formatData(mindmapByKeys) {
    const root = Object.keys(this.props.mindmapByKeys)[0];
    convertToMindmap(mindmapByKeys[root], mindmapByKeys[root]);
    this.setState({ data: [mindmapByKeys["1"]] });
  }

  componentDidMount() {
    this.formatData(this.props.mindmapByKeys);
  }

  toggleEnterState = () => {
    this.setState({ in: !this.state.in });
  };

  addNode() {}

  render() {
    return (
      <div style={{ width: "50em", height: "20em" }}>
        {this.state.data.length > 0 && (
          <MindmapTree
            separation={{ siblings: 2, nonSiblings: 2 }}
            transitionDuration={0}
            data={this.state.data}
          />
        )}
      </div>
    );
  }
}
export default Tree;
