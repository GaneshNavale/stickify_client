import React from "react";
import { Grid2 as Grid } from "@mui/material";
import CustomTextField from "./CustomTextField";

const ProductQuantityOptions = (props) => {
  const { quantityOption, setQuantityOption, setErrors, errors } = props;

  const handleFieldChange = (fieldName, value) => {
    setQuantityOption({
      ...quantityOption,
      [fieldName]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  const numberValidator = (value) =>
    value === "" || (parseFloat(value) > 0 && /^\d*\.?\d*$/.test(value));

  const fields = [
    {
      label: "Min Quantity",
      fieldName: "min_quantity",
      type: "number",
      validator: numberValidator,
    },
    {
      label: "Max Quantity",
      fieldName: "max_quantity",
      type: "number",
      validator: numberValidator,
    },
    {
      label: "Min Quantity for Discount",
      fieldName: "min_quantity_for_discount",
      type: "number",
      validator: numberValidator,
    },
    {
      label: "Max Discount(%)",
      fieldName: "max_discount",
      type: "number",
      validator: (value) =>
        numberValidator(value) && (value === "" || parseFloat(value) < 100),
    },
    {
      label: "Default Quantity Options",
      fieldName: "default_quantity_options",
      helperText: "Comma Separated Values",
    },
    {
      label: "Allowed Quantity in Multiples",
      fieldName: "quantity_in_multiple_of",
      validator: numberValidator,
    },
  ];

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>Quantity Options</Grid>
      <Grid item container spacing={2}>
        {fields.map(({ label, fieldName, type, validator, helperText }) => (
          <Grid item size={6} key={fieldName}>
            <CustomTextField
              label={label}
              fieldName={fieldName}
              value={quantityOption[fieldName]}
              onChange={handleFieldChange}
              error={!!errors[fieldName]}
              helperText={errors[fieldName] || helperText}
              validator={validator}
              type={type || "text"}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ProductQuantityOptions;
