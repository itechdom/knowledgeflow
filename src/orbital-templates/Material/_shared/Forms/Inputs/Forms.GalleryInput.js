import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Button } from "@material-ui/core";
import ImageFileInput from "./Forms.ImageFileInput";

const GalleryInput = ({
  gallery,
  field,
  onMediaDelete,
  setCurrentGalleryIndex,
  currentGalleryIndex,
  onGalleryDrop
}) => (
  <div>
    <h2>{field.placeholder}</h2>
    <ImageFileInput multiple id={field.name} onDrop={onGalleryDrop} />
    {gallery && gallery.length > 0 ? (
      <ImageGallery
        items={gallery.map(image => {
          return {
            original: image,
            thumbnail: image
          };
        })}
        onSlide={index => {
          setCurrentGalleryIndex(index);
        }}
        renderCustomControls={() => {
          return (
            <Button
              className="image-gallery-custom-action"
              style={{ float: "right" }}
              onClick={() => {
                onMediaDelete(
                  gallery[currentGalleryIndex],
                  currentGalleryIndex,
                  true
                );
              }}
            >
              Delete Image
            </Button>
          );
        }}
      />
    ) : (
      ""
    )}
  </div>
);

export default GalleryInput;
