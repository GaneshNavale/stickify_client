import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import * as API from "../../../utils/api";
import { useAuth } from "../../../hooks/useAuth";

const UpdateUserDetail = ({ open, onClose }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      sx={{
        padding: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleUserDetailUpdateSubmit}
        sx={{
          padding: 4,
          gap: 2,
        }}
      >
        <Typography variant="h5">Update User Details</Typography>

        <FormControl fullWidth>
          <FormLabel htmlFor="name" sx={{ marginTop: 2, marginBottom: 1 }}>
            Name
          </FormLabel>
          <TextField
            id="name"
            name="name"
            type="text"
            size="small"
            value={userDetail.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="email" sx={{ marginTop: 2, marginBottom: 1 }}>
            Email
          </FormLabel>
          <TextField
            id="email"
            name="email"
            type="email"
            size="small"
            value={userDetail.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel
            htmlFor="dateOfBirth"
            sx={{ marginTop: 2, marginBottom: 1 }}
          >
            Date of Birth
          </FormLabel>
          <TextField
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={userDetail.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.dateOfBirth)}
            helperText={errors.dateOfBirth}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="mobile" sx={{ marginTop: 2, marginBottom: 1 }}>
            Mobile
          </FormLabel>
          <TextField
            id="mobile"
            name="mobile"
            type="tel"
            size="small"
            value={userDetail.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.mobile)}
            helperText={errors.mobile}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="website" sx={{ marginTop: 2, marginBottom: 1 }}>
            Website
          </FormLabel>
          <TextField
            id="website"
            name="website"
            type="url"
            size="small"
            value={userDetail.website}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.website)}
            helperText={errors.website}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="bio" sx={{ marginTop: 2, marginBottom: 1 }}>
            Bio
          </FormLabel>
          <TextField
            id="bio"
            name="bio"
            multiline
            size="small"
            rows={3}
            value={userDetail.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your bio"
          />
        </FormControl>

        <Box sx={{ textAlign: "right", marginTop: 2 }}>
          <Button onClick={onClose} variant="text" sx={{ marginRight: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!change}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UpdateUserDetail;
