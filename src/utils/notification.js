import React from "react";
import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";

const Notification = (props) => {
  const { alert, setAlert } = props;
  return (
    <Box sx={{ width: "100%", padding: 5 }}>
      <Collapse in={!!alert?.message}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert({ message: "", type: "" });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity={alert?.type}
        >
          {alert?.message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default Notification;
