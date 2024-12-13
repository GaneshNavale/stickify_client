import React, { useState, useEffect } from "react";
import { Grid2 as Grid, IconButton, Tooltip, Typography } from "@mui/material"; // Updated import for Grid
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageUploader = ({
  imageUrl,
  onImageChange,
  width = "100%", // Default width as 100%
  height = 200, // Default height as 200px
  helperText = "",
  error = false,
}) => {
  const [preview, setPreview] = useState(imageUrl); // State to manage preview
  const [dragging, setDragging] = useState(false); // State to manage drag behavior

  // Update the preview if image_url prop changes
  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    onImageChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle the drag-over event (to show drop target)
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  // Handle the drag-leave event (to remove drop target highlight)
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handle the drop event (to process the dropped file)
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0]; // Get the first file from the drop
    if (file) {
      onImageChange(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange(null);
  };

  const handleClick = () => {
    document.getElementById("image-upload").click();
  };

  return (
    <Grid container>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          "position": "relative",
          "width": width, // Dynamic width from props
          "height": height, // Dynamic height from props
          "overflow": "hidden", // Hide overflow
          "border": "2px dashed #ccc",
          "borderColor": error ? "red" : dragging ? "#007BFF" : "#ccc",
          "borderRadius": "8px",
          "backgroundColor": "#f5f5f5",
          "&:hover": {
            backgroundColor: "transparent",
            borderColor: "#007BFF",
            cursor: "default",
          },
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Category Preview"
            style={{
              objectFit: "contain", // Maintain aspect ratio of the image
              width: "100%", // Ensure the image fits within the container
              height: "100%",
            }}
          />
        ) : (
          <Grid item sx={{ color: "#aaa", textAlign: "center" }}>
            No Image Selected
          </Grid>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="image-upload"
        />
        {preview && (
          <label htmlFor="image-delete">
            <Tooltip title="Delete Image">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                component="span"
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <DeleteIcon color="primary" />
              </IconButton>
            </Tooltip>
          </label>
        )}
        {/* File upload button */}
        <label htmlFor="image-upload">
          <Tooltip title="Upload Image">
            <IconButton
              component="span"
              sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                backgroundColor: "#fff",
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <PhotoCamera fontSize="large" color="primary" />
            </IconButton>
          </Tooltip>
        </label>
      </Grid>
      {/* Show error message below the image uploader */}
      {helperText && (
        <Typography
          variant="caption"
          color="error"
          sx={{ paddingLeft: 2, mt: 0.5 }}
        >
          {helperText}
        </Typography>
      )}
    </Grid>
  );
};

export default ImageUploader;
