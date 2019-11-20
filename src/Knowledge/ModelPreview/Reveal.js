import React from "react";
import NodeEl from "./Node";
const Reveal = ({ Node }) => {
  if (typeof Node === "undefined") {
    return <h5>-</h5>;
  }
  if (typeof Node === "object") {
    return Object.keys(Node).map(key => {
      return <Reveal Node={Node[key]} />;
    });
  }
  if (typeof Node === "array") {
    return Node.map(n => {
      return <Reveal Node={n} />;
    });
  }
  if (typeof Node === "string") {
    return <NodeEl level={"0"} title={Node} hasChildren={false} />;
  }
  return <h1>--------------------------</h1>;
};

export default Reveal;
