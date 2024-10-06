import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DeleteDescriptionModal = (props) => {
  const { open, description, cancelDelete, confirmDelete } = props;

  return (
    <Dialog open={open} onClose={cancelDelete}>
      <DialogTitle id="new_category">
        Confirm Deletion
        <CloseIcon
          onClick={cancelDelete}
          sx={{ cursor: "pointer", position: "absolute", right: 8, top: 8 }}
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <b>Title: </b>
          {description.title}
        </DialogContentText>
        <DialogContentText paddingTop={2}>
          Are you sure you want to delete this description? This action cannot
          be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={cancelDelete} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => confirmDelete(description.id)}
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDescriptionModal;
