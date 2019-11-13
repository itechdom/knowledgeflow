import React from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import { Paper } from "@material-ui/core";

function MyDropzone({ field, onMediaDrop, media }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onMediaDrop
  });
  const dottedBox = {
    border: "1px dotted black",
    height: "300px",
    width: "300px"
  };
  return (
    <Dropzone onDrop={onMediaDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Paper style={dottedBox}>Drop the files here ...</Paper>
            ) : (
              <Paper style={dottedBox}>
                Drag 'n' drop some files here, or click to select files
                {media ? <img src={media} /> : ""}
              </Paper>
            )}
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default MyDropzone;
