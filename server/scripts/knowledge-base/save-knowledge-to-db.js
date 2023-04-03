const {
  readFiles,
  connectToDb,
  formatMindmap,
  flattenMindmap,
} = require("./utils");
const knowledgeModel = require("@markab.io/orbital-api/MongoDb/models/knowledge");
const getDiff = (existing, newData) => {
  let tmp = {};
  Object.keys(existing).map((k, index) => {
    let ob = existing[k];
    tmp = {
      ...tmp,
      [ob.title]: ob,
    };
    return;
  });
  let tmp2 = { ...newData };
  Object.keys(newData).map((id, index) => {
    let newOb = newData[id];
    if (tmp[newOb.title]) {
      tmp2 = {
        [id]: newOb,
        ...newData,
      };
    }
    tmp2 = {
      [id]: newOb,
      ...newData,
    };
  });
  return tmp2;
};
connectToDb((err, data) => {
  if (err) {
    return console.error(err);
  }
  readFiles(
    "./data/",
    (filename, content) => {
      let formattedNodeList = JSON.parse(content).ideas;
      let level = 0;
      formattedNodeList && formatMindmap(formattedNodeList, level);
      const flatMindmap = {};
      flattenMindmap(formattedNodeList, null, flatMindmap);
      const titleSections = filename.split("-");
      let knowledgeData = {
        title: filename.replace(".mup", "").split("-")[
          titleSections.length - 1
        ],
        tags: titleSections.slice(0, titleSections.length - 1),
        body: flatMindmap,
      };
      knowledgeModel.findOne({ title: knowledgeData.title }, (err, res) => {
        if (err) {
          return console.error(err);
        }
        if (res) {
          //merge to existing mindmaps
          const diff = getDiff(res.body, knowledgeData.body);
          knowledge.body = diff;
        } else {
          let knowledge = new knowledgeModel(knowledgeData);
          return knowledge.save((err) => {
            if (err) {
              console.log("err creating knowledge", err);
              return;
            }
            console.log(`${titleSections} saved!`);
          });
        }
      });
    },
    (err) => {
      console.log("err", err);
    }
  );
  console.log("DONE");
  return;
});
