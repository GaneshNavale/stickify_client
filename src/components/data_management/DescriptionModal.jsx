import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid2 as Grid,
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideoUploader from "../../utils/VideoUploader";
import MultiImageUploader from "../../utils/MultiImageUploader";
import * as API from "../../utils/adminApi";

const DescriptionModal = (props) => {
  const { id, type, open, selectedDescription, handleModalClose, setAlert } =
    props;
  const [description, setDescription] = useState({
    title: "",
    body: "",
    media_type: "none",
    images: [],
    newImages: [],
    video: null,
  });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    body: "",
    media_type: "",
    images: "",
    video: "",
  });

  useEffect(() => {
    if (selectedDescription) {
      setDescription({
        title: selectedDescription.title,
        body: selectedDescription.body,
        media_type: selectedDescription.media_type || "none",
        images: selectedDescription.images || [],
        video: selectedDescription.video || null,
        newVideo: null,
      });
    } else {
      setDescription({
        title: "",
        body: "",
        media_type: "none",
        images: [],
        video: null,
      });
    }
  }, [selectedDescription]);

  const handleImageChange = (newImages) => {
    setDescription((prevState) => ({ ...prevState, newImages: newImages }));
    const totalImages =
      (description.images?.length || 0) + (newImages.length || 0);
    if (totalImages > 2) {
      errors.media_type = "";
    }
  };

  const handleImageRemove = (id) => {
    const updatedImages = description.images.filter((image) => image.id !== id);
    setDescription((prevState) => ({ ...prevState, images: updatedImages }));
  };

  const handleVideoChange = (video) => {
    if (video) {
      setErrors({
        ...errors,
        media_type: "",
      });
    }
    setDescription((prevState) => ({
      ...prevState,
      newVideo: video,
      video: video ? prevState.video : null,
    }));
  };

  const validateFields = () => {
    let errors = {};
    if (!description.title.trim()) {
      errors.title = "Title is required.";
    }
    if (!description.body.trim()) {
      errors.body = "Description body is required.";
    }
    if (description.media_type === "image") {
      const totalImages =
        (description.images?.length || 0) +
        (description.newImages?.length || 0);
      if (totalImages < 3) {
        errors.media_type =
          "At least 3 images are required. Please upload Images.";
      }
    } else if (
      description.media_type === "video" &&
      !description.video &&
      !description.newVideo
    ) {
      errors.media_type = "No video uploaded. Please upload a video.";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setOpenBackdrop(true);
    const formData = new FormData();
    formData.append("description[title]", description.title);
    formData.append("description[body]", description.body);
    formData.append("description[media_type]", description.media_type);
    formData.append("describable_type", type);
    formData.append("describable_id", id);

    if (description.media_type === "image") {
      if (selectedDescription) {
        const removedImageIds = selectedDescription.images
          .map((image) => image.id)
          .filter(
            (id) => !description.images.map((image) => image.id).includes(id)
          );
        removedImageIds.forEach((id) => {
          formData.append("description[removed_image_ids][]", id);
        });
      }

      description?.newImages?.forEach((image) => {
        formData.append("description[images][]", image);
      });
    } else if (description.media_type === "video" && description.newVideo) {
      formData.append("description[video]", description.newVideo);
    }

    try {
      if (selectedDescription) {
        const response = await API.updateDescription(
          selectedDescription.id,
          formData
        );
        handleModalClose(response.data);
      } else {
        const response = await API.createDescription(formData);
        handleModalClose(response.data);
      }
      setDescription({
        title: "",
        body: "",
        media_type: "none",
        images: [],
        video: null,
      });
    } catch (error) {
      setAlert({ message: "Failed to save description.", type: "error" });
    } finally {
      setOpenBackdrop(false);
    }
  };

  const onClose = () => {
    setDescription({
      title: "",
      body: "",
      media_type: "none",
      images: [],
      video: null,
    });
    handleModalClose();
  };
  const handleBlur = (name) => {
    let newErrors = { ...errors };

    if (name === "title" && !description.title) {
      newErrors.title = "Title is required.";
    } else if (name === "body" && !description.body) {
      newErrors.body = "Description body is required.";
    } else {
      if (name === "title") newErrors.title = "";
      if (name === "body") newErrors.body = "";
    }

    setErrors(newErrors);
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="new_description">
        {selectedDescription ? "Edit Description" : "New Description"}
        <CloseIcon
          onClick={onClose}
          sx={{ cursor: "pointer", position: "absolute", right: 8, top: 8 }}
        />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Media Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={description.media_type}
                label="Media Type"
                onChange={(e) => {
                  const newMediaType = e.target.value;

                  setDescription((prevState) => ({
                    ...prevState,
                    media_type: newMediaType,
                  }));

                  setErrors({ ...errors, media_type: "" });
                }}
                error={!!errors.media_type}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
              </Select>

              <FormHelperText color="danger" error>
                {errors.media_type}
              </FormHelperText>
            </FormControl>
          </Grid>

          {description.media_type === "image" && (
            <Grid item>
              <MultiImageUploader
                images={description.images}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
              />
            </Grid>
          )}

          {description.media_type === "video" && (
            <Grid item>
              <VideoUploader
                videoUrl={description.video?.url}
                onVideoChange={handleVideoChange}
              />
            </Grid>
          )}

          <Grid item>
            <TextField
              label="Title"
              type="text"
              size="small"
              fullWidth
              value={description.title}
              onChange={(e) =>
                setDescription({ ...description, title: e.target.value })
              }
              onBlur={() => handleBlur("title")}
              error={!!errors.title}
              helperText={errors.title}
              margin="dense"
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label="Description Body"
              multiline
              size="small"
              rows={3}
              fullWidth
              value={description.body}
              onBlur={() => handleBlur("body")}
              error={!!errors.body}
              helperText={errors.body}
              onChange={(e) =>
                setDescription({ ...description, body: e.target.value })
              }
              placeholder="Enter description body"
              margin="dense"
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleSubmit}
          disabled={openBackdrop}
        >
          {selectedDescription ? "Update" : "Create"}
        </Button>
      </DialogActions>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default DescriptionModal;
