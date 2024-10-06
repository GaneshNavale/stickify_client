import React, { useState } from "react";
import { Button, Grid2 as Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MultiImageUploader = ({ images = [], onImageChange, onImageRemove }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle new file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const updatedFiles = [...selectedFiles, ...files];
    setSelectedFiles(updatedFiles);
    onImageChange(updatedFiles); // Update the parent component with new selected images
  };

  // Remove an uploaded image (either a newly selected or existing image)
  const handleRemove = (index, isExistingImage) => {
    if (isExistingImage) {
      onImageRemove(index); // Notify the parent component to remove the image from existing images
    } else {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);
      onImageChange(updatedFiles); // Update the parent component with remaining files
    }
  };

  return (
    <div>
      {/* Button to upload new images */}
      <Button variant="contained" component="label">
        Upload Images
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {/* Grid to display selected image previews (both new and existing) */}
      <Grid container spacing={2} style={{ marginTop: "16px" }}>
        {/* Display pre-existing image URLs (for editing existing descriptions) */}
        {images.length > 0 &&
          images.map((image) => (
            <Grid size={{ xs: 3 }} key={`existing-${image.id}`}>
              <div style={{ position: "relative" }}>
                <img
                  src={image.url}
                  alt={`uploaded-${image.id}`}
                  style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <IconButton
                  aria-label="delete"
                  onClick={() => handleRemove(image.id, true)} // Indicate it's an existing image
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </Grid>
          ))}

        {/* Display newly selected image previews */}
        {selectedFiles.map((file, index) => (
          <Grid size={{ xs: 3 }} key={`new-${index}`}>
            <div style={{ position: "relative" }}>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <IconButton
                aria-label="delete"
                onClick={() => handleRemove(index, false)} // Indicate it's a newly selected image
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MultiImageUploader;
