"use strict";

var Xray = require("x-ray");
const fs = require("fs");
var x = Xray();

function stripHtml(html) {
  let regex = /(<([^>]+)>)/gi;
  return html.replace(regex, "");
}

// x("http://localhost:8000/hm.html", ".product-item", [
//   {
//     title: "h3"
//   }
// ]).write("hm.json");

x("https://en.wikipedia.org/wiki/Physics", "#mw-content-text").then(
  (res) => {
    let content = stripHtml(res);
    fs.writeFileSync("../../../python/assets/wiki.txt", content);
  }
);
