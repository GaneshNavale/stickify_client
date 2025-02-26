import React from "react";
import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";

const renderStatusChip = (status) => {
  switch (status) {
    case "Delivered":
      return (
        <Chip
          label="Delivered"
          color="success"
          icon={<CheckCircleIcon />}
          size="small"
        />
      );
    case "Pending":
      return (
        <Chip
          label="Pending"
          color="warning"
          icon={<LocalShippingIcon />}
          size="small"
        />
      );
    case "Canceled":
      return (
        <Chip
          label="Canceled"
          color="error"
          icon={<CancelIcon />}
          size="small"
        />
      );
    case "Paid":
      return (
        <Chip
          label="paid"
          color="success"
          icon={<CheckCircleIcon />}
          size="small"
        />
      );
    case "Confirmed":
      return (
        <Chip
          label="Confirmed"
          color="info"
          icon={<CheckCircleIcon />}
          size="small"
        />
      );
    case "Created":
      return (
        <Chip label="Created" color="info" icon={<InfoIcon />} size="small" />
      );
    default:
      return null;
  }
};

export default renderStatusChip;
