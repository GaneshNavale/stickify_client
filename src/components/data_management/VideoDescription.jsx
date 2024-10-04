import React, { useState } from "react";
import { Typography, Card, CardContent, Fab } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DescriptionModal from "./DescriptionModal";
import EditIcon from "@mui/icons-material/Edit";

const VideoDescription = ({
  categoryId,
  description,
  setDescriptions,
  setAlert,
  deleteDescriptionBtn,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setAlert({ type: "", message: "" });
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedDescription) => {
    if (updatedDescription) {
      setDescriptions((prevDescriptions) =>
        prevDescriptions.map((desc) =>
          desc.id === updatedDescription.id ? updatedDescription : desc
        )
      );
      setAlert({
        type: "success",
        message: "Description Updated Successfully.",
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Card
        sx={{
          padding: "20px",
          width: "100%",
          minHeight: 200,
        }}
      >
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
            <video
              controls
              src={description.video?.url}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                maxHeight: 200, // Ensures the video has consistent height
              }}
            />
          </Grid>

          <Grid item size={{ xs: 12, md: 6, lg: 8 }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {description.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {description.body}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {isEditModalOpen && (
        <DescriptionModal
          categoryId={categoryId}
          open={isEditModalOpen}
          handleModalClose={handleModalClose}
          selectedDescription={description}
          setDescriptions={setDescriptions}
        />
      )}

      <Fab
        color="primary"
        aria-label="edit"
        size="small"
        onClick={handleEditClick}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 65,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <EditIcon />
      </Fab>
      {deleteDescriptionBtn(description.id)}
    </div>
  );
};

export default VideoDescription;
