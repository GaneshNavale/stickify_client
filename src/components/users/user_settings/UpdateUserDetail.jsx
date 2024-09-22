import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Button,
  Grid2 as Grid,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import * as API from "../../../utils/api";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB"; // Import the English (UK) locale

import { IconButton, Avatar, Box, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useAuth } from "../../../hooks/useAuth";

const UpdateUserDetail = ({ open, onClose }) => {
  const { user, login } = useAuth();
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(dayjs(user.dob || ""));
  const [dobError, setDobError] = useState(null);
  const [userDetail, setUserDetail] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    website: user.website,
    bio: user.bio,
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

    // Optional fields, no required checks
    switch (fieldName) {
      case "mobile":
        if (value && !/^\d+$/.test(value)) {
          fieldErrors.mobile = "Mobile number should contain only digits";
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
      console.log("U are in handle update");
      const userParams = {
        name: userDetail.name,
        bio: userDetail.bio,
        mobile: userDetail.mobile,
        website: userDetail.website,
        avatar_image: userDetail.avatar,
        dob: dateOfBirth?.format("DD-MM-YYYY"),
      };

      API.updateUserDetail(userParams)
        .then((response) => {
          console.log("response", response);
          const updatedUser = {
            ...response.data.user,
            token: user.token,
          };
          login(updatedUser);
          onClose();
        })
        .catch((error) => {})
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

  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Update the image state
      };
      reader.readAsDataURL(file);
    }
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
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item md={12}>
            <TextField
              label="Name"
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
              label="Email"
              name="email"
              type="email"
              size="small"
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={dateOfBirth}
                onChange={(newValue) => {
                  setDateOfBirth(newValue);
                  setHasChanges(true);
                }}
                disableFuture
                format="DD-MM-YYYY"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    height: "40px",
                  },
                }}
                onError={(newError) => setDobError(newError)}
                slotProps={{
                  textField: {
                    helperText: dobErrorMessage,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* <Grid item>
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dayjs("2022-04-17")}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.dateOfBirth)}
              helperText={errors.dateOfBirth}
              margin="dense"
            />
          </Grid> */}
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
              multiline
              size="small"
              rows={3}
              fullWidth
              value={userDetail.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your bio"
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 3 }}>
        <Grid container spacing={2} direction="row">
          <Grid item>
            <Button onClick={onClose}>Cancel</Button>
          </Grid>
          <Grid item sx={{ marginRight: 2 }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!hasChanges}
              onClick={handleUserDetailUpdateSubmit}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
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

export default UpdateUserDetail;
