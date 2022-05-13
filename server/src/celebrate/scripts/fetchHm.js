"use strict";
var Xray = require("x-ray");
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

x("http://news.ycombinator.com", "body@html").then((res) => {
  console.log(stripHtml(res));
});
