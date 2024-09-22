import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import * as API from "../../../utils/api";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../hooks/useAuth";

const UpdateUserAccountPassword = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    mobile: "",
    website: "",
    bio: "",
  });
  const { user, login } = useAuth();

  useEffect(() => {
    if (
      currentPassword.trim() !== "" &&
      newPassword.trim() !== "" &&
      confirmNewPassword.trim() !== ""
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [currentPassword, newPassword, confirmNewPassword]);

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
  }, [user.id]);

  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setNewPasswordErrorMessage("Password Must Contain Atleast 6 Letters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    const updatedUserDetail = {
      ...userDetail,
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmNewPassword,
    };

    API.updateUserPassword(updatedUserDetail)
      .then((response) => {
        const newToken = response.headers["authorization"];

        if (newToken) {
          const updatedUser = {
            ...user,
            token: newToken.replace("Bearer ", ""),
            // token: newToken.replace("Bearer ", ""), is write because to replace Bearer word with the empty string ex "bearer qwertyuioiuytrewqwsdfgyu765432" it will save "qwertyuioiuytrewqwsdfgyu765432" only
          };

          login(updatedUser);
          console.log(
            "Password updated and token refreshed successfully",
            updatedUser
          );
          onClose();
        }
      })
      .catch((error) => {
        console.error("Error updating password", error);
        setErrorMessage("Error updating password. Please try again.");
      });
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Password</DialogTitle>
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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            size="small"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            size="small"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
          />

          {newPasswordErrorMessage && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {newPasswordErrorMessage}
            </Typography>
          )}
          <TextField
            label="Confirm New Password"
            type="password"
            size="small"
            fullWidth
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            margin="normal"
            required
          />

          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}

          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isButtonDisabled}
            >
              Update Password
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserAccountPassword;
