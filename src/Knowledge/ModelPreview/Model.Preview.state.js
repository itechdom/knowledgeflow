//move this to kb service
import uuidv1 from "uuid/v1";
export const handleNodeAdd = (
  mindmapByKeys,
  setMindmapByKeys,
  nodeId,
  title
) => {
  const _id = uuidv1();
  const parent = mindmapByKeys[nodeId];
  let group = parent && parseInt(parent.level.split(".").join(""));
  let size = 20 / (parent && parent.level.split(".").length);
  const newState = {
    ...mindmapByKeys,
    [nodeId]: {
      ...mindmapByKeys[nodeId],
      children: [...mindmapByKeys[nodeId].children, _id]
    },
    [_id]: {
      _id,
      id: _id,
      title,
      level:
        mindmapByKeys[nodeId].level +
        "." +
        mindmapByKeys[nodeId].children.length,
      children: [],
      parent: nodeId,
      size,
      group,
      links: {
        source: parent,
        target: _id,
        title: title
      }
    }
  };
  setMindmapByKeys(newState);
};

export const handleNodeEdit = (mindmapByKeys, setEditedNode, nodeId) => {
  setEditedNode(nodeId);
};

export const handleNodeUpdate = (
  mindmapByKeys,
  setMindmapByKeys,
  setEditedNode,
  updateModel,
  model,
  nodeId,
  { key, value }
) => {
  const newState = {
    ...mindmapByKeys,
    [nodeId]: {
      ...mindmapByKeys[nodeId],
      [key]: value
    }
  };
  setMindmapByKeys(newState, () => {
    handleNodeSave(updateModel, model, newState);
    setEditedNode("");
  });
};

export const handleNodeSave = (updateModel, model, mindmapByKeys) => {
  //format mindmapByKeys
  let newMindmap = {};
  Object.keys(mindmapByKeys).map(kn => {
    return (newMindmap[kn] = {
      ...mindmapByKeys[kn],
      links: {
        source: mindmapByKeys[kn].parent || mindmapByKeys[kn]._id,
        target: mindmapByKeys[kn]._id,
        title: mindmapByKeys[kn].title
      }
    });
  });
  updateModel(model, { body: newMindmap });
};

export const handleNodeDelete = (mindmapByKeys, setMindmapByKeys, nodeId) => {
  const parent = mindmapByKeys[nodeId].parent;
  const {
    [nodeId]: {},
    ...mindmapByKeysWithoutNodeId
  } = mindmapByKeys;
  const newState = {
    ...mindmapByKeysWithoutNodeId,
    [parent]: {
      ...mindmapByKeys[parent],
      children: mindmapByKeys[parent].children.filter(id => id !== nodeId)
    }
  };
  setMindmapByKeys(newState);
};

export const handleNodeSwap = (mindmapByKeys, nodeAId, nodeBId) => {};

export const handleNodeToggle = (mindmapByKeys, setMindmapByKeys, nodeId) => {
  let currentParent = mindmapByKeys[nodeId].parent;
  let parents = {};
  do {
    if (currentParent) {
      parents[currentParent] = {
        ...mindmapByKeys[currentParent],
        visible: true
      };
    }
    currentParent = currentParent && mindmapByKeys[currentParent].parent;
  } while (currentParent);
  setMindmapByKeys(prevState => {
    return {
      ...prevState,
      ...parents,
      [nodeId]: {
        ...prevState[nodeId],
        visible: !!!mindmapByKeys[nodeId].visible
      }
    };
  });
};

export const comparePath = (currentLevel, visibleLevel) => {
  let visibleArray = visibleLevel.split(".");
  let currentArray = currentLevel.split(".");
  return currentArray.map((lev, index) => {
    return visibleArray[index] === lev;
  });
};

export const isVisible = (mindmapByKeys, visibleNodeKeys, nodeId) => {
  const currentLevel = mindmapByKeys[nodeId].level;
  let visible = true;
  if (visibleNodeKeys[currentLevel] === false) {
    visible = false;
  } else {
    visible =
      Object.keys(visibleNodeKeys).filter(visibleLevel => {
        let res = comparePath(
          mindmapByKeys[nodeId].level,
          visibleLevel,
          visibleNodeKeys[visibleLevel]
        );
        return res.indexOf(false) === -1;
      }).length > 0;
  }
  return visible;
};
