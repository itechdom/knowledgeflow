const fs = require("fs");
let files = fs.readdirSync("./assets/game/Tiles/");
const tiles = `
const tiles = [${files.map((f) => `"${f}"`)}]
export default tiles;
`;
fs.writeFileSync("./src/GameBoard/assets.js", tiles);
