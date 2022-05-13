const { readFiles, connectToDb, formatMindmap, flattenMindmap } = require("./utils")
const knowledgeModel = require("../@markab.io/orbital-api/MongoDb/models/knowledge")
connectToDb((err, data) => {
  readFiles(
    "../Knowledge/data/",
    (filename, content) => {
      let formattedNodeList = JSON.parse(content).ideas;
      let level = 0;
      formattedNodeList && formatMindmap(formattedNodeList, level);
      const flatMindmap = {};
      flattenMindmap(formattedNodeList, null, flatMindmap);
      const titleSections = filename.split("-");
      let knowledge = new knowledgeModel({
        title: filename.replace(".json", "").split("-")[
          titleSections.length - 1
        ],
        tags: titleSections.slice(0, titleSections.length - 1),
        body: flatMindmap
      });
      knowledge.save(err => {
        if (err) {
          console.log("err creating knowledge", err);
          return;
        }
        console.log(`${titleSections} saved!`);
      });
    },
    err => {
      console.log("err", err);
    }
  );
});
