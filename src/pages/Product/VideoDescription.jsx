import React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const VideoDescription = ({ videoData }) => {
  return (
    <Grid container spacing={2} size={{ width: "100%", marginTop: 2 }}>
      <Grid item size={{ xs: 12, md: 6 }}>
        <Box sx={{ width: "100%", height: "auto" }}>
          <iframe
            width="100%"
            height="315"
            src={videoData.videoUrl}
            title={videoData.heading}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: "none" }}
          ></iframe>
        </Box>
      </Grid>

      <Grid item size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            height: "100%",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: "bold", fontSize: "2rem" }}
          >
            {videoData.heading}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginTop: 2 }}>
            {videoData.description}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default VideoDescription;
