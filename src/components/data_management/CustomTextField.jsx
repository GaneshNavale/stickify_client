import React from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required = true,
  type = "text",
  validator = () => true,
  fieldName,
  fullWidth = true,
  size = "small",
  ...props
}) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (validator(inputValue)) {
      onChange(fieldName, inputValue);
    }
  };

  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={helperText || error}
      required={required}
      fullWidth={fullWidth}
      size={size}
      {...props}
    />
  );
};

export default CustomTextField;
