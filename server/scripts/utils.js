const MongoDb = require("../src/Orbital/MongoDb");
const config = require("config");
const fs = require("fs");
const uuidv1 = require("uuid/v1");
const path = require("path");
module.exports.readFiles = function readFiles(dirname, onFileContent, onError) {
  fs.readdir(path.join(__dirname, dirname), function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(path.join(__dirname, dirname) + filename, "utf-8", function(
        err,
        content
      ) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
};
module.exports.connectToDb = function connectToDb(cb) {
  const dbConnection = MongoDb({
    config,
    onDBInit: data => cb(null, data),
    onError: err => cb("err", err),
    onDisconnect: err => cb("disconnect", err)
  });
  return dbConnection;
};
module.exports.formatMindmap = function formatMindmap(node, path) {
  if (node) {
    Object.keys(node).map((key, index) => {
      let currentPath = path ? path + "." + `${index}` : "0";
      node[key].level = currentPath;
      node[key]._id = uuidv1();
      return formatMindmap(node[key].ideas, currentPath);
    });
  }
  return;
};

//TODO: flatten mindmap prior to saving and add links for graph viz
module.exports.flattenMindmap = function flattenMindmap(
  node,
  parent,
  mindmapByKeys
) {
  if (node) {
    let group = parent && parseInt(parent.level.split(".").join(""));
    let size = 20 / (parent && parent.level.split(".").length);
    Object.keys(node).map((key, index) => {
      const currentNode = node[key];
      const { title } = currentNode;
      mindmapByKeys[currentNode._id] = {
        title,
        id: currentNode._id,
        _id: currentNode._id,
        size,
        group: group,
        level: currentNode.level,
        attr:
          currentNode.attr &&
          currentNode.attr.note &&
          currentNode.attr.note.text,
        children: currentNode.ideas
          ? Object.keys(currentNode.ideas).map(k => {
              return currentNode.ideas[k]._id;
            })
          : [],
        parent: parent && parent._id,
        links: {
          title: parent && parent.title,
          target: currentNode._id,
          source: (parent && parent._id) || currentNode._id,
          group: group
        }
      };
      flattenMindmap(currentNode.ideas, currentNode, mindmapByKeys);
    });
  }
  return;
};
