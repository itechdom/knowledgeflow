module.exports = function recurReadFiles(folder, onFile, onError) {
  if (folder.indexOf("build") !== -1 || folder.indexOf("node_modules") !== -1) {
    return;
  }
  let filenames = fs.readdirSync(folder);
  filenames.forEach(function(filename) {
    const currentFolder = folder + "/" + filename;
    if (fs.lstatSync(currentFolder).isDirectory()) {
      return recurReadFiles(currentFolder, onFile, onError);
    }
    onFile(filename, folder, fs.readFileSync(currentFolder, "utf-8"));
  });
};
