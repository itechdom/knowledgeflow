// try {
//   window.requestFileSystem(
//     window.LocalFileSystem.PERSISTENT,
//     0,
//     fs => {
//       alert("file system opened");
//       window.resolveLocalFileSystemURL(
//         window.cordova.file.dataDirectory,
//         dirEntry => {
//           alert("dir entry" + JSON.stringify(dirEntry));
//           dirEntry.getFile(
//             data,
//             { create: false, exclusive: true },
//             fileEntry => {
//               // what you want to do
//               alert("file entry");
//               alert(JSON.stringify(fileEntry));
//             },
//             onFail
//           );
//         },
//         onFail
//       );
//     },
//     onFail
//   );
// } catch (err) {
//   alert("ERR" + err);
// }
// window.requestFileSystem(
//   LocalFileSystem.PERSISTENT,
//   0,
//   function(fs) {
//     fs.root.getFile(
//       data,
//       {},
//       function(fileEntry) {
//         alert("hello");
//         // alert(fileEntry.toURL());
//         // readFile(fileEntry);
//       },
//       onFail
//     );
//   },
//   onFail
// );

// try {
//   var exifObj = piexif.load(image);
// } catch (err) {
//   alert("Error loading image", err);
// }

function readFile(fileEntry) {
  fileEntry.file(function(file) {
    var reader = new FileReader();

    reader.onloadend = function() {
      alert("Successful file read: " + this.result);
    };

    reader.readAsText(file);
  }, onFail);
}
