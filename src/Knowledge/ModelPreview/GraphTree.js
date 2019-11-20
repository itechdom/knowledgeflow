import React from "react";
import ForceGraph2D from "react-force-graph-2d";
class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: { nodes: [], links: [] },
      showText: false
    };
    this.renderer = {};
  }
  updateGraphContainerWidth() {}
  componentDidMount() {
    window.addEventListener(
      "resize",
      this.updateGraphContainerWidth.bind(this)
    );
    let graphNodes = Object.keys(this.props.mindmapByKeys).map(nodeId => {
      return this.props.mindmapByKeys[nodeId];
    });
    let graphLinks = Object.keys(this.props.mindmapByKeys).map(nodeId => {
      return this.props.mindmapByKeys[nodeId].links;
    });
    this.setState({
      graphData: {
        nodes: graphNodes,
        links: graphLinks
      }
    });
  }

  toggleEnterState = () => {
    this.setState({ in: !this.state.in });
  };

  addNode() {}

  render() {
    return this.state.showText ? (
      <ForceGraph2D
        graphData={this.state.graphData}
        width={this.props.width || 700}
        height={this.props.height || 700}
        nodeLabel={node => {
          if (node.attr && node.attr.note && node.attr.note.text) {
            return node.title + ": \n" + node.attr.note.text;
          }
          return node.title;
        }}
        nodeVal={node => {
          return node.size;
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.title;
          const fontSize = 15 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            n => n + fontSize * 0.2
          ); // some padding
          ctx.fillStyle = "#000000";
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(label, node.x, node.y);
        }}
      />
    ) : (
      <ForceGraph2D
        graphData={this.state.graphData}
        // centerAt={null}
        width={this.props.width || 700}
        height={this.props.height || 700}
        nodeLabel={node => {
          if (node.attr && node.attr.note && node.attr.note.text) {
            return node.title + ": \n" + node.attr.note.text;
          }
          return node.title;
        }}
        nodeVal={node => {
          return node.size;
        }}
        nodeAutoColorBy="group"
        linkAutoColorBy="group"
      />
    );
  }
}
export default Tree;
