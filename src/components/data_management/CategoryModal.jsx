// CategoryModal.js

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
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as API from "../../utils/adminApi";
import ImageUploader from "../../utils/ImageUploader";
import { useNavigate } from "react-router-dom";

const CategoryModal = (props) => {
  const { open, selectedCategory, handleModalClose } = props;
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    display_name: "",
    description: "",
    image: null,
    active: false,
  });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  useEffect(() => {
    if (selectedCategory) {
      setCategory({
        name: selectedCategory.name,
        display_name: selectedCategory.display_name || "",
        description: selectedCategory.description || "",
        image: selectedCategory.image || null,
        active: selectedCategory.active || false,
      });
    } else {
      setCategory({
        name: "",
        display_name: "",
        description: "",
        image: null,
      });
    }
  }, [selectedCategory]);

  const handleImageChange = (image) => {
    setCategory({ ...category, image: image });
  };

  const handleSwitchChange = (event) => {
    console.log("event", event.target.checked);
    setCategory({ ...category, active: event.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenBackdrop(true);

    const formData = new FormData();
    formData.append("category[name]", category.name);
    formData.append("category[display_name]", category.display_name);
    formData.append("category[description]", category.description || "");
    formData.append("category[active]", category.active || false);
    if (category.image) {
      formData.append("category[image]", category.image);
    }

    try {
      if (selectedCategory) {
        const response = await API.updateCategory(
          selectedCategory.id,
          formData
        );
        handleModalClose(response.data.category);
      } else {
        const response = await API.createCategory(formData);
        navigate(`/admin/categories/${response.data.category.slug}`, {
          replace: true,
          state: {
            alert: {
              message: "Category created Successfully.",
              type: "success",
            },
          },
        });
        onClose();
      }
    } catch (error) {
      setAlert({ message: "Failed to save category.", type: "error" });
    } finally {
      setOpenBackdrop(false);
    }
  };

  const onClose = () => {
    handleModalClose();
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="new_category">
        {selectedCategory ? "Edit Category" : "New Category"}
        <CloseIcon
          onClick={onClose}
          sx={{ cursor: "pointer", position: "absolute", right: 8, top: 8 }}
        />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} direction="column">
          {/* Image Preview Section */}
          <Grid item>
            <ImageUploader
              imageUrl={selectedCategory?.image_url}
              onImageChange={handleImageChange}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Name"
              type="text"
              size="small"
              fullWidth
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
              margin="dense"
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label="Display Name"
              type="text"
              size="small"
              fullWidth
              value={category.display_name}
              onChange={(e) =>
                setCategory({ ...category, display_name: e.target.value })
              }
              margin="dense"
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label="Description"
              multiline
              size="small"
              rows={3}
              fullWidth
              value={category.description}
              onChange={(e) =>
                setCategory({ ...category, description: e.target.value })
              }
              placeholder="Enter description"
              margin="dense"
              required
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={category.active}
                  onChange={handleSwitchChange}
                  color="primary"
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Active"
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
          {selectedCategory ? "Update" : "Create"}
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

export default CategoryModal;
