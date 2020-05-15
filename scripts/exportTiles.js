const fs = require("fs");
fs.readdirSync("./assets/game/Tiles", (err, files) => {
  files.forEach((file) => {
    console.log(file);
  });
});
fs.readdirSync("./assets/game/Roads", (err, files) => {
  files.forEach((file) => {
    console.log(file);
  });
});
