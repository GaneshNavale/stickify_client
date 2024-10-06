import React, { useState } from "react";
import ImageDescription from "./ImageDescription";
import VideoDescription from "./VideoDescription";
import {
  Button,
  Grid2 as Grid,
  Typography,
  Fab,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DescriptionModal from "./DescriptionModal";
import DeleteDescriptionModal from "./DeleteDescriptionModal";
import * as API from "../../utils/adminApi";

const DescriptionList = (props) => {
  const { categoryId, descriptions, setDescriptions, setAlert } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDesription, setSelectedDesription] = useState({});

  const handleDeleteClick = (descriptionId) => {
    setSelectedDesription(
      descriptions.find((item) => item.id === descriptionId)
    );
    setIsDeleteDialogOpen(true);
  };

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

  const confirmDelete = (descriptionId) => {
    setOpenBackdrop(true);
    API.deleteDescription(descriptionId, {
      describable_type: "Category",
      describable_id: categoryId,
    })
      .then((response) => {
        setDescriptions((prevDescriptions) =>
          prevDescriptions.filter((desc) => desc.id !== descriptionId)
        );
        setAlert({
          type: "success",
          message: "Description Deleted Successfully.",
        });
        setIsDeleteDialogOpen(false);
      })
      .finally(() => {
        setOpenBackdrop(false);
      });
  };

  const cancelDelete = () => {
    setSelectedDesription({});
    setIsDeleteDialogOpen(false);
  };

  const deleteDescriptionBtn = (descriptionId) => {
    return (
      <Fab
        color="error"
        aria-label="delete"
        size="small"
        onClick={() => handleDeleteClick(descriptionId)}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16, // Adjust position to the left of the edit button
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <DeleteIcon />
      </Fab>
    );
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
                deleteDescriptionBtn={deleteDescriptionBtn}
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
                deleteDescriptionBtn={deleteDescriptionBtn}
              />
            </Grid>
          )
        )}
      </Grid>
      <DescriptionModal
        categoryId={categoryId}
        open={isModalOpen}
        handleModalClose={handleModalClose}
        setAlert={setAlert}
        setDescriptions={setDescriptions}
      />
      <DeleteDescriptionModal
        open={isDeleteDialogOpen}
        description={selectedDesription}
        cancelDelete={cancelDelete}
        confirmDelete={confirmDelete}
      />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
};

export default DescriptionList;
