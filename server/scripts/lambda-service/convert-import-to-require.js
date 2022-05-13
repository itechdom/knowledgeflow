const path = require("path");
const fs = require("fs");
function formatJsFile(file) {
  const lines = file.split("\n");
  return lines.map((line, index) => {
    if (line.indexOf("import") !== -1) {
      if (line === "import {") {
        let flag = true;
        let currIndex = index;
        while (flag) {
          if (lines[currIndex].indexOf(";") !== -1) {
            flag = false;
          }
          if (lines[currIndex].indexOf("from") !== -1) {
          }
          currIndex++;
        }
      }
      if (line.indexOf("from") !== -1) {
        const afterFrom = line.split(" ");
        afterFrom[afterFrom.length - 1] =
          "require(" + afterFrom[afterFrom.length - 1].replace(";", "") + ")";
        line = afterFrom.join(" ");
      }
    }
    if (line.indexOf("export default") !== -1) {
      line = line.replace("export default", `module.exports = `);
    }
    if (line.indexOf("} = ") !== -1) {
      const afterEqual = line.split(" ");
      afterEqual[afterEqual.length - 1] =
        "require(" + afterEqual[afterEqual.length - 1].replace(";", "") + ")";
      line = afterEqual.join(" ");
    }
    line = line.replace("import", "const");
    line = line.replace("from", "=");
    return line;
  });
}
function recurReadFiles(folder) {
  if (folder.indexOf("build") !== -1 || folder.indexOf("node_modules") !== -1) {
    return;
  }
  fs.readdir(folder, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      const currentFolder = folder + "/" + filename;
      if (fs.lstatSync(currentFolder).isDirectory()) {
        return recurReadFiles(currentFolder);
      }
      return fs.readFile(currentFolder, "utf-8", function(err, content) {
        if (err) {
          console.error(err);
          return;
        }
        if (filename.indexOf(".js") !== -1) {
          if (filename.indexOf(".jsh" !== -1)) {
            fs.unlinkSync(currentFolder);
          }
          return fs.writeFileSync(
            currentFolder,
            formatJsFile(content).join("\n")
          );
        }
        return;
      });
    });
  });
}
const folder = path.resolve(__dirname, "../../../", "orbital-node-services/");
recurReadFiles(folder);
