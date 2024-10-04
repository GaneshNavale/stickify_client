import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const VideoUploader = ({ videoUrl, onVideoChange }) => {
  const [video, setVideo] = useState(videoUrl || null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "" });

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "video/mp4") {
        setAlert({ open: true, message: "Please upload a valid MP4 video." });
        return;
      }
      setLoading(true);
      const videoURL = URL.createObjectURL(file);
      setVideo(videoURL);
      onVideoChange(file); // Send the file back to the parent
      setLoading(false);
    }
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    onVideoChange(null); // Notify parent that video has been removed
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, message: "" });
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : video ? (
        <Box sx={{ position: "relative" }}>
          <video width="100%" controls>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <IconButton
            aria-label="remove video"
            onClick={handleRemoveVideo}
            style={{
              position: "absolute",
              top: "10px", // Positioned at the top-right
              right: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 2, // Ensures it appears above the video
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box>
          <Button variant="contained" component="label">
            Upload Video
            <input
              type="file"
              accept="video/mp4"
              hidden
              onChange={handleVideoUpload}
            />
          </Button>
        </Box>
      )}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        message={alert.message}
      />
    </Box>
  );
};

export default VideoUploader;
