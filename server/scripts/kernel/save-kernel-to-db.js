const {
  readFiles,
  connectToDb,
  formatMindmap,
  flattenMindmap
} = require("../utils");
const kernelModel = require("../../src/Orbital/MongoDb/models/kernel");
connectToDb((err, data) => {
  readFiles(
    "../../data/",
    (filename, content) => {
      let formattedNodeList = JSON.parse(content).ideas;
      let level = 0;
      formattedNodeList && formatMindmap(formattedNodeList, level);
      const flatMindmap = {};
      flattenMindmap(formattedNodeList, null, flatMindmap);
      const titleSections = filename.split("-");
      let kernel = new kernelModel({
        title: filename.replace(".json", "").split("-")[
          titleSections.length - 1
        ],
        tags: titleSections.slice(0, titleSections.length - 1),
        body: flatMindmap
      });
      kernel.save(err => {
        if (err) {
          console.log("err creating kernel", err);
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
