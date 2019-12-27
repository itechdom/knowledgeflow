import React, { Component } from "react";
import PropTypes from "prop-types";
import { TileMap } from "react-game-kit";

export default class Level extends Component {
  static contextTypes = {
    scale: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      stageX: 0
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { stageX } = nextProps;
    const targetX = Math.round(stageX * nextContext.scale);
    this.setState({
      stageX: targetX
    });
  }

  componentWillUnmount() {}

  getWrapperStyles() {
    return {
      position: "absolute",
      transform: `translate(${this.state.stageX}px, 0px) translateZ(0)`,
      transformOrigin: "top left"
    };
  }

  render() {
    let { fileLocation, user } = this.props;
    return (
      <div style={this.getWrapperStyles()}>
        <TileMap
          style={{ top: Math.floor(64 * this.context.scale) }}
          src={`${fileLocation}/boardwalktile.png`}
          tileSize={128}
          columns={24}
          rows={4}
          layers={[
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ]
          ]}
        />
        <TileMap
          style={{ top: Math.floor(-63 * this.context.scale) }}
          src={`${fileLocation}/buildings.png`}
          rows={1}
          columns={6}
          tileSize={512}
          layers={[[1, 2, 3, 4, 5, 6]]}
        />
      </div>
    );
  }
}
