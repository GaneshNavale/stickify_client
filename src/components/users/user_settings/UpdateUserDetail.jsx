import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  Grid2 as Grid,
  Backdrop,
  CircularProgress,
  Divider,
} from "@mui/material";

import * as API from "../../../utils/api";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import AvatarUpload from "./AvatarUpload";

import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { IconButton } from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const UpdateUserDetail = ({ open, onClose }) => {
  const navigate = useNavigate();

  const { user, login } = useAuth();
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dob ? dayjs(user.dob, "DD-MM-YYYY") : null
  );

  const [dobError, setDobError] = useState(null);
  const [userDetail, setUserDetail] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile || "",
    website: user.website || "",
    bio: user.bio || "",
    avatar_image_url: user.avatar_image_url || "",
    avatarImage: "",
  });

  const dobErrorMessage = React.useMemo(() => {
    switch (dobError) {
      case "disableFuture": {
        return "Date of Birth can't be a future date";
      }
      case "invalidDate": {
        return "Your date is not valid";
      }
      default: {
        return "";
      }
    }
  }, [dobError]);

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (event) => {
    if (!event) return;
    const { name, value } = event.target;
    setUserDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "name":
        if (!value) {
          fieldErrors.name = "Full name is required.";
        } else {
          fieldErrors.name = "";
        }
        break;
      case "mobile":
        if (value && !/^\d{10}$/.test(value)) {
          fieldErrors.mobile = "Mobile number must be 10 digits.";
        } else {
          fieldErrors.mobile = "";
        }
        break;
      case "website":
        if (value && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)) {
          fieldErrors.website = "Website URL is not valid";
        } else {
          fieldErrors.website = "";
        }
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
    return fieldErrors;
  };

  const handleUserDetailUpdateSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = validateAllFields();
    setAlert({ message: "", type: "" });
    setErrors(fieldErrors);

    const isFormValid = Object.values(fieldErrors).every(
      (error) => error === ""
    );
    if (hasChanges && isFormValid && !dobError) {
      setOpenBackdrop(true);
      let userParams = {
        name: userDetail.name,
        bio: userDetail.bio,
        mobile: userDetail.mobile,
        website: userDetail.website,
      };

      const formData = new FormData();

      for (const key in userParams) {
        formData.append(`user[${key}]`, userParams[key]);
      }

      if (userDetail.avatarImage) {
        formData.append("user[avatar_image]", userDetail.avatarImage);
      }

      formData.append("user[dob]", dateOfBirth?.format("DD-MM-YYYY") || "");

      API.updateUserDetail(formData)
        .then((response) => {
          const updatedUser = {
            ...response.data.user,
            token: user.token,
          };
          login(updatedUser);
          onClose();
          navigate("/user_account_settings", {
            state: {
              alert: {
                message: "User Details updated successfully!",
                type: "success",
              },
            },
          });
        })
        .catch((error) => {
          setAlert({ message: "Failed to update user details", type: "error" });
          console.error("Update user error:", error);
        })
        .finally(() => {
          setOpenBackdrop(false);
        });
    }
  };

  const validateAllFields = () => {
    const fieldErrors = {};
    Object.keys(userDetail).forEach((key) => {
      const errorsForField = validateField(key, userDetail[key]);
      fieldErrors[key] = errorsForField[key] || "";
    });

    return fieldErrors;
  };

  const handleImageUpload = (imageData) => {
    setUserDetail((prevState) => ({
      ...prevState,
      avatarImage: imageData,
    }));
    setHasChanges(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="update-user-details-title"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="update-user-details-title">
        Update User Details
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
        })}
      >
        <CloseIcon />
      </IconButton>
      <Divider />
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <AvatarUpload
              avatarImageUrl={user.avatar_image_url}
              onImageUpload={handleImageUpload}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Name *"
              name="name"
              type="text"
              size="small"
              fullWidth
              value={userDetail.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.name)}
              helperText={errors.name}
              margin="dense"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Email *"
              name="email"
              type="email"
              size="small"
              disabled={true}
              fullWidth
              value={userDetail.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.email)}
              helperText={errors.email}
              margin="dense"
            />
          </Grid>

          <Grid item>
            <DatePicker
              label="Date of Birth"
              name="dob"
              value={dateOfBirth}
              onChange={(newValue) => {
                setDateOfBirth(newValue);
                setHasChanges(true);
              }}
              disableFuture
              format="DD-MM-YYYY"
              onBlur={handleBlur}
              onError={(newError) => setDobError(newError)}
              slotProps={{
                textField: {
                  size: "small",
                  helperText: dobErrorMessage,
                  fullWidth: true,
                },
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Mobile"
              name="mobile"
              type="tel"
              size="small"
              fullWidth
              value={userDetail.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile}
              margin="dense"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Website"
              name="website"
              type="url"
              size="small"
              fullWidth
              value={userDetail.website}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.website)}
              helperText={errors.website}
              margin="dense"
            />
          </Grid>

          <Grid item>
            <TextField
              label="Bio"
              name="bio"
              type="text"
              size="small"
              multiline
              fullWidth
              rows={3}
              value={userDetail.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleUserDetailUpdateSubmit}
          variant="contained"
          color="primary"
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </DialogActions>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default UpdateUserDetail;
