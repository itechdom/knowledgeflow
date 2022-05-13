const uuid = require("uuid/v1");
const SERVICES = [
  "Media",
  "Crud",
  "Auth",
  "Socket",
  "Admin",
  "Forms",
  "Notification",
  "Game",
  "LoginWithAuth",
  "RegisterWithAuth",
  "KB",
  "EventWithCrud"
];
const fs = require("fs");
module.exports = function(file, api, options, callback) {
  let tree = {};
  const j = api.jscodeshift;
  let root = j(file.source);
  root.find(j.JSXElement).forEach(path => {
    let el = path.value.openingElement.name.name;
    let attrs = path.value.openingElement.attributes;
    if (el === "Route") {
      let routeName;
      const _id = uuid();
      attrs.find(attr => {
        if (attr.name.name === "path") {
          tree[_id] = {};
          routeName = attr.value.value;
        }
      });
      tree[_id] = { title: routeName, id: _id };
      let lastPath = findNextJSXElement(j, j(path), tree[_id], routeName);
      if (lastPath.value) {
        j(lastPath)
          .find(j.JSXElement)
          .forEach(path => {
            //this is the last element which is basically the page component
            // console.log("path", path.value.openingElement.name.name);
          });
      }
    }
  });
  fs.writeFileSync(
    "./data/kernel.json",
    JSON.stringify({
      id: "root",
      formatVersion: "3",
      ideas: {
        "1": {
          title: "Orbital",
          ideas: tree
        }
      }
    })
  );
};

function findNextJSXElement(j, root, tree, routeName) {
  let newRoot = {};
  tree.ideas = {};
  root.find(j.JSXElement).forEach(path => {
    let el = path.value.openingElement.name.name;
    if (SERVICES.indexOf(el) !== -1) {
      let attrs = path.value.openingElement.attributes;
      const _id = uuid();
      const attributeChildren = {};
      attrs.map(attr => {
        const attributeId = uuid();
        attributeChildren[attributeId] = {
          title: attr.name.name,
          value: attr.value.value
        };
      });
      tree.ideas[_id] = { title: el, ideas: attributeChildren, id: _id };
      newRoot = path;
    }
  });
  return newRoot;
}
