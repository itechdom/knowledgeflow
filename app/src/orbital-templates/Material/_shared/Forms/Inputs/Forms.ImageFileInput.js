import React from "react";
import Dropzone, { useDropzone } from "react-dropzone";

function MyDropzone({ field, onMediaDrop, media }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onMediaDrop
  });
  return (
    <Dropzone onDrop={onMediaDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default MyDropzone;
