import { List, Paper, Grid } from "@material-ui/core";
import React from "react";
import MindmapTree from "react-d3-tree";
import Node from "./Node";
import { TransitionGroup, Transition } from "react-transition-group";

export const convertToMindmap = node => {
  if (node) {
    Object.keys(node).map(key => {
      const currentNode = node[key];
      currentNode.name = currentNode.title;
      currentNode._collapsed = false;
      currentNode.children =
        currentNode.ideas &&
        Object.keys(currentNode.ideas).map(key => {
          let child = currentNode.ideas[key];
          child.name = child.title;
          return child;
        });
      return convertToMindmap(node[key].ideas);
    });
  }
  return;
};
class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  formatData(nodeList) {
    convertToMindmap(nodeList, null);
    this.setState({ data: [nodeList["1"]] });
  }

  componentDidMount() {
    this.formatData(this.props.nodeList);
  }

  toggleEnterState = () => {
    this.setState({ in: !this.state.in });
  };

  addNode() {}

  render() {
    console.log(this.state.data);
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
