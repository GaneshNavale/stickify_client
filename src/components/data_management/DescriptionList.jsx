import React, { useState } from "react";
import ImageDescription from "./ImageDescription";
import VideoDescription from "./VideoDescription";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DescriptionModal from "./DescriptionModal";

const DescriptionList = (props) => {
  const { categoryId, descriptions, setDescriptions, setAlert } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = (updatedDescription) => {
    if (updatedDescription) {
      setDescriptions((prevDescriptions) => [
        updatedDescription,
        ...prevDescriptions,
      ]);
      setAlert({
        type: "success",
        message: "Description Created Successfully.",
      });
    }
    setIsModalOpen(false);
  };

  return (
    <Grid container py={3}>
      <Grid size={{ xs: 6 }}>
        <Typography variant="h5" gutterBottom>
          Descriptions
        </Typography>
      </Grid>
      <Grid display="flex" size={{ xs: 6 }} justifyContent="end">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsModalOpen(true);
          }}
          aria-label="Add new Description"
        >
          Description
        </Button>
      </Grid>
      <Grid size={{ xs: 12 }}>
        {(descriptions || []).map((description) =>
          description.media_type === "image" ||
          description.media_type === "none" ? (
            <Grid size={{ xs: 12 }} py={2}>
              <ImageDescription
                key={description.id}
                categoryId={categoryId}
                description={description}
                setAlert={setAlert}
                setDescriptions={setDescriptions}
              />
            </Grid>
          ) : (
            <Grid size={{ xs: 12 }} py={2}>
              <VideoDescription
                key={description.id}
                categoryId={categoryId}
                description={description}
                setAlert={setAlert}
                setDescriptions={setDescriptions}
              />
            </Grid>
          )
        )}
      </Grid>
      {isModalOpen && (
        <DescriptionModal
          categoryId={categoryId}
          open={isModalOpen}
          handleModalClose={handleModalClose}
          setAlert={setAlert}
          setDescriptions={setDescriptions}
        />
      )}
    </Grid>
  );
};

export default DescriptionList;
