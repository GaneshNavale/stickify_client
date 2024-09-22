import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as API from "../../../utils/api";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB"; // Import the English (UK) locale

import { IconButton, Avatar, Box, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useAuth } from "../../../hooks/useAuth";

const UpdateUserDetail = ({ open, onClose }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedDate, setSelectedDate] = useState(null);

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    mobile: "",
    website: "",
    bio: "",
  });

  const [change, setChange] = useState(false);

  useEffect(() => {
    API.getUserDetail(user.id).then((response) => {
      setUserDetail((prevDetail) => ({
        ...prevDetail,
        name: response.data.user.name,
        email: response.data.user.email,
        dateOfBirth: response.data.user.dateOfBirth,
        mobile: response.data.user.mobile,
        website: response.data.user.website,
        bio: response.data.user.bio,
      }));
    });
  }, []);

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const initialDetails = {
      name: user.name || "",
      email: user.email || "",
      dateOfBirth: user.dateOfBirth || "",
      mobile: user.mobile || "",
      website: user.website || "",
      bio: user.bio || "",
    };
    setUserDetail(initialDetails);
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setChange(true);
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
      case "email":
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          fieldErrors.email = "Email is not valid";
        } else {
          fieldErrors.email = "";
        }
        break;
      case "dateOfBirth":
        if (value && !/\d{4}-\d{2}-\d{2}/.test(value)) {
          fieldErrors.dateOfBirth = "Date of birth is not valid";
        } else {
          fieldErrors.dateOfBirth = "";
        }
        break;
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

  // function to convert date from yyyy-mm-dd to dd-mm-yyyy
  function reformatDate(dateString) {
    if (
      typeof dateString !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
      // throw new Error("Invalid date format. Expected yyyy-mm-dd.");
    }
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  const handleUserDetailUpdateSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = validateAllFields();

    if (hasChanges) {
      console.log("U are in handle update");
      const userParams = {
        name: `${userDetail.name}`,
        bio: userDetail.bio,
        mobile: userDetail.mobile,
        website: userDetail.website,
        avatar_image: userDetail.avatar,
      };

      API.updateUserDetail(userParams)
        .then((response) => {
          onClose();
        })
        .catch((error) => {});
    } else {
      console.log("No changes detected");
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
      aria-labelledby="update-user-details-title"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <Box position="relative" display="inline-block">
        <Avatar
          src={image || "default-image-url.jpg"} // Replace with your default image URL
          sx={{
            width: 100,
            height: 100,
            opacity: 0.7, // Reduced opacity
          }}
        />
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "50%",
            zIndex: 1,
          }}
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
          <CameraAltIcon />
        </IconButton>
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            zIndex: 0, // Place text behind the button
            fontWeight: "bold",
          }}
        >
          Update
        </Typography>
      </Box>

      <DialogTitle id="update-user-details-title">
        Update User Details
      </DialogTitle>
      <DialogContent>
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
          sx={{ marginTop: 3 }}
        />
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
          sx={{ marginTop: 3 }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
          <DatePicker
            label="Select Date"
            value={userDetail.dateOfBirth}
            onChange={(date) => setSelectedDate(date)}
            inputFormat="dd-MM-yy"
            sx={{
              padding: -1,
              width: "100%",
              marginTop: 3,
              size: "small",
            }}
          />
        </LocalizationProvider>
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
          sx={{ marginTop: 3 }}
        />
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
          sx={{ marginTop: 3 }}
        />
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
          sx={{ marginTop: 3 }}
        />
      </DialogContent>
      <DialogActions sx={{ marginTop: 3, marginRight: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={!change}
          onClick={handleUserDetailUpdateSubmit}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserDetail;
