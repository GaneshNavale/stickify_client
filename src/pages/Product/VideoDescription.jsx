import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const VideoDescription = ({ videoData }) => {
  const [currentVideoData, setCurrentVideoData] = useState([]);

  useEffect(() => {
    const normalizedVideoData = Array.isArray(videoData)
      ? videoData
      : [videoData];
    setCurrentVideoData(normalizedVideoData);
  }, [videoData]);

  return (
    <Grid container spacing={2} sx={{ width: "100%", marginTop: 2 }}>
      {currentVideoData.length > 0 ? (
        currentVideoData.map((videoItem, index) => (
          <React.Fragment key={index}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box sx={{ width: "100%", height: "auto" }}>
                <video
                  width="100%"
                  height="315"
                  src={videoItem.video?.url || ""}
                  title={videoItem.title || `Video ${index + 1}`}
                  controls
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: "none" }}
                />
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
                  {videoItem.title ||
                    `No Title Available for Video ${index + 1}`}
                </Typography>
                <Typography variant="body1" component="p" sx={{ marginTop: 2 }}>
                  {videoItem.body || "No Description Available"}
                </Typography>
              </Box>
            </Grid>
          </React.Fragment>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginTop: 2 }}
          >
            No videos available for this category.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default VideoDescription;
