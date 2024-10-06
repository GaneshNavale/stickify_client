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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    display_name: "",
    description: "",
    image: null,
    active: false,
    image_url: "",
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
        image_url: selectedCategory.image_url,
      });
    }
  }, [selectedCategory]);

  const handleImageChange = (image) => {
    if (image) {
      setCategory({ ...category, image: image });
      let newErrors = { ...errors };
      delete newErrors.image; // Clear image error if an image is selected
      setErrors(newErrors);
    }
  };

  const handleSwitchChange = (event) => {
    setCategory({ ...category, active: event.target.checked });
  };

  const validateFields = () => {
    let errors = {};
    if (!category.name.trim()) {
      errors.name = "Name is required";
    }
    if (!category.display_name.trim()) {
      errors.display_name = "Display Name is required";
    }
    if (!category.description.trim()) {
      errors.description = "Description is required";
    }
    if (!category.image && !category.image_url) {
      errors.image = "Image is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field) => (e) => {
    if (!e.target.value.trim()) {
      setErrors({ ...errors, [field]: `${field} is required` });
    } else {
      let newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

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
    setErrors({});
    setCategory({
      name: "",
      display_name: "",
      description: "",
      image: null,
      active: false,
      image_url: "",
    });
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
              error={!!errors.image}
              helperText={errors.image}
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
              onBlur={handleBlur("name")}
              error={!!errors.name}
              helperText={errors.name}
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
              onBlur={handleBlur("display_name")}
              error={!!errors.display_name}
              helperText={errors.display_name}
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
              onBlur={handleBlur("description")}
              error={!!errors.description}
              helperText={errors.description}
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
