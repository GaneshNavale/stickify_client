import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Fab } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Grid from "@mui/material/Grid2";
import DescriptionModal from "./DescriptionModal";
import EditIcon from "@mui/icons-material/Edit";

const ImageDescription = ({
  categoryId,
  description,
  setDescriptions,
  setAlert,
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

  const images = description.media_type !== "none";

  return (
    <div style={{ position: "relative" }}>
      <Card
        sx={{
          padding: "20px",
          flexGrow: 1,
          minHeight: 200,
        }}
      >
        <Grid container spacing={2}>
          {/* Image List with Quilted Layout */}
          {images && (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <ImageList
                variant="quilted"
                cols={3} // Total 4 columns for quilted layout
                gap={8}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              >
                {description.images.map((image, index) => (
                  <ImageListItem
                    key={image.id}
                    cols={index === 0 ? 2 : 1} // 1st image spans 2 columns
                    rows={index === 0 ? 2 : 1} // 1st image spans 2 rows
                  >
                    <img src={image.url} alt={`${image.id}`} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          )}

          <Grid
            item
            size={{
              xs: 12,
              md: images ? 6 : 12,
              lg: images ? 8 : 12,
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {description.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {description.body}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {isEditModalOpen && (
        <DescriptionModal
          open={isEditModalOpen}
          categoryId={categoryId}
          handleModalClose={handleModalClose}
          selectedDescription={description}
          setAlert={setAlert}
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
          right: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <EditIcon />
      </Fab>
    </div>
  );
};

export default ImageDescription;
