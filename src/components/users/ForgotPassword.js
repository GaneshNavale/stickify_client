import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Dialog,
  Backdrop,
  CircularProgress,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as API from "../../utils/api";

const ForgotPassword = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const navigate = useNavigate();

  const handleBackdropClose = () => setOpenBackdrop(false);
  const handleBackdropOpen = () => setOpenBackdrop(true);

  const validateEmailField = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Email is not valid";
    return "";
  };

  const handleBlur = (value) => {
    const errorMsg = validateEmailField(value);
    setError(errorMsg);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errorMsg = validateEmailField(email);
    setError(errorMsg);

    if (!errorMsg) {
      sendPasswordReset();
    }
  };

  const sendPasswordReset = async () => {
    try {
      handleBackdropOpen();
      await API.sendResetPasswordInstruction({
        email,
        redirect_url: `${process.env.REACT_APP_DOMAIN}/reset_user_password`,
      });
      navigate("/", {
        replace: true,
        state: {
          alert: {
            message: `We emailed ${email} with a link to reset your password`,
            type: "success",
          },
        },
      });
    } catch (error) {
      console.error("Password Reset Error:", error.response);
      navigate("/", {
        replace: true,
        state: {
          alert: {
            message: `We emailed ${email} with a link to reset your password`,
            type: "success",
          },
        },
      });
    } finally {
      handleBackdropClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a
          link to reset your password.
        </DialogContentText>
        <TextField
          error={!!error}
          helperText={error}
          autoFocus
          value={email}
          margin="dense"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          onBlur={(event) => {
            handleBlur(event.target.value);
          }}
          id="email"
          name="email"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
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

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
