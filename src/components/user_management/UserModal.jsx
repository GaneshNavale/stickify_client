import { useState, useMemo, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import { Backdrop, CircularProgress, TextField } from "@mui/material";
import AvatarUpload from "../users/user_settings/AvatarUpload";
import { DatePicker } from "@mui/x-date-pickers";
import * as API from "../../utils/adminApi";

const UserModal = (props) => {
  const { open, setOpen, user, setAlert, fetchUsers } = props;
  console.log("user", user);
  const newUser = !user?.id;
  const handleClose = () => {
    setOpen(false);
  };

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [errors, setErrors] = useState({});

  const [dobError, setDobError] = useState(null);
  const [userDetail, setUserDetail] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    website: user?.website || "",
    bio: user?.bio || "",
    avatarImage: "",
    avatar_image_url: user?.avatar_image_url || "",
  });

  useEffect(() => {
    setUserDetail({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      website: user?.website || "",
      bio: user?.bio || "",
      avatarImage: "",
      avatar_image_url: user?.avatar_image_url || "",
    });
    setDateOfBirth(user?.dob ? dayjs(user.dob, "DD-MM-YYYY") : null);
    setErrors({});
    setDobError();
  }, [user]);

  const dobErrorMessage = useMemo(() => {
    console.log("error", dobError);
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

  const handleImageUpload = (imageData) => {
    setUserDetail((prevState) => ({
      ...prevState,
      avatarImage: imageData,
    }));
  };

  const handleChange = (event) => {
    if (!event) return;
    const { name, value } = event.target;
    setUserDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const validateAllFields = () => {
    const fieldErrors = {};
    Object.keys(userDetail).forEach((key) => {
      const errorsForField = validateField(key, userDetail[key]);
      fieldErrors[key] = errorsForField[key] || "";
    });

    return fieldErrors;
  };

  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    // Optional fields, no required checks
    switch (fieldName) {
      case "name":
        if (!value) {
          fieldErrors.name = "Name is required";
        } else {
          fieldErrors.name = "";
        }
        break;
      case "email":
        if (!value) {
          fieldErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors.email = "Email is not valid";
        } else {
          fieldErrors.email = "";
        }
        break;
      case "mobile":
        if (value && !/^\d+$/.test(value)) {
          fieldErrors.mobile = "Mobile number should contain only digits";
        } else if (!/^\d{10}$/.test(value)) {
          fieldErrors.mobile = "Mobile number should contain exactly 10 digits";
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

  const handleSubmitAPI = (formData) => {
    return newUser
      ? API.createUser(formData)
      : API.updateUser(user.id, formData);
  };

  const handleUserDetailSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = validateAllFields();
    setAlert({ message: "", type: "" });
    setErrors(fieldErrors);

    const isFormValid = Object.values(fieldErrors).every(
      (error) => error === ""
    );

    if (isFormValid && !dobError) {
      setOpenBackdrop(true);
      let userParams = {
        name: userDetail.name,
        email: userDetail.email,
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

      formData.append(
        "user[dob]",
        dateOfBirth ? dateOfBirth.format("DD-MM-YYYY") : ""
      );

      handleSubmitAPI(formData)
        .then((response) => {
          fetchUsers();
          handleClose();
          setAlert({
            message: `User ${newUser ? "created" : "updated"} successfully`,
            type: "success",
          });
        })
        .catch((error) => {
          setAlert({
            message: `Failed to ${newUser ? "created" : "updated"} User`,
            type: "error",
          });
          console.error("user error:", error);
        })
        .finally(() => {
          setOpenBackdrop(false);
        });
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{}} id="new_user">
        {newUser ? "New User" : "Edit User"}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <AvatarUpload
              avatarImageUrl={user?.avatar_image_url}
              onImageUpload={handleImageUpload}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Name*"
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
              label="Email*"
              name="email"
              type="email"
              size="small"
              fullWidth
              value={userDetail.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={!newUser}
              margin="dense"
            />
          </Grid>

          <Grid item>
            <DatePicker
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(newValue) => {
                setDateOfBirth(newValue);
              }}
              format="DD-MM-YYYY"
              disableFuture
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
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item px={2} py={0.2}>
            <Button
              variant="outlined"
              onClick={handleUserDetailSubmit}
              disabled={openBackdrop}
            >
              {newUser ? "Create" : "Update"}
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

export default UserModal;
