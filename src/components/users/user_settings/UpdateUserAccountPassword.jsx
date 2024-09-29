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
  Backdrop,
  CircularProgress,
} from "@mui/material";
import * as API from "../../../utils/api";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../hooks/useAuth";

const UpdateUserAccountPassword = ({ open, onClose, setAlert }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [openBackdrop, setOpenBackdrop] = useState(false);
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

  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");

  const handleOnClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    onClose();
  };

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
    setOpenBackdrop(true);
    const updatedUserDetail = {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmNewPassword,
    };

    API.updateUserPassword(updatedUserDetail)
      .then((response) => {
        const newToken = response.headers["authorization"];

        if (newToken) {
          setAlert({
            message: "User password updated successfully",
            type: "success",
          });
          const updatedUser = {
            ...user,
            //is write because to replace Bearer word with the empty string ex "bearer qwertyuioiuytrewqwsdfgyu765432" it will save "qwertyuioiuytrewqwsdfgyu765432" only
            token: newToken.replace("Bearer ", ""),
          };

          login(updatedUser);
          handleOnClose();
        }
      })
      .catch((error) => {
        console.error("Error updating password", error);
        setErrorMessage("Error updating password. Please try again.");
      })
      .finally(() => {
        setOpenBackdrop(false);
      });
  };

  return (
    <Dialog open={open} handleOnClose={handleOnClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Password</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleOnClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
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
            <Button onClick={handleOnClose} color="primary">
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default UpdateUserAccountPassword;
