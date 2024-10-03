import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
    <Box sx={{ textAlign: "center", my: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : video ? (
        <Box>
          <video width="100%" controls>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <IconButton
            color="error"
            onClick={handleRemoveVideo}
            aria-label="remove video"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <Box>
          <Typography variant="body1">
            No video uploaded. Please upload a video.
          </Typography>
          <Button variant="contained" component="label" sx={{ mt: 1 }}>
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
