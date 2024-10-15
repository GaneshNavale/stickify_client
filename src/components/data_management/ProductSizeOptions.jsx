import React, { useState } from "react";
import { Button, Grid2 as Grid, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CustomTextField from "./CustomTextField";

const ProductSizeOptions = (props) => {
  const { sizeOption, setSizeOption, errors, setErrors } = props;
  const [defaultHeight, setDefaultHeight] = useState();
  const [defaultWidth, setDefaultWidth] = useState();

  const handleDefaultOptionAdd = () => {
    const exists = sizeOption.default_height_options.some(
      (height, index) =>
        height === defaultHeight &&
        sizeOption.default_width_options[index] === defaultWidth
    );
    if (!exists) {
      setSizeOption((prevOption) => ({
        ...prevOption,
        default_height_options: [
          ...prevOption.default_height_options,
          defaultHeight,
        ],
        default_width_options: [
          ...prevOption.default_width_options,
          defaultWidth,
        ],
      }));
      setDefaultHeight("");
      setDefaultWidth("");
      setErrors({
        ...errors,
        defaultHeight: "",
        defaultWidth: "",
      });
    } else {
      setErrors({
        ...errors,
        defaultHeight: "Already taken",
        defaultWidth: "Already taken",
      });
    }
  };

  const handleRemoveChip = (index) => {
    setSizeOption((prevOption) => ({
      ...prevOption,
      default_height_options: prevOption.default_height_options.filter(
        (_, i) => i !== index
      ),
      default_width_options: prevOption.default_width_options.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    console.log("fieldName", fieldName);
    console.log("value", value);
    setSizeOption({
      ...sizeOption,
      [fieldName]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  const fields = [
    {
      label: "Min Height",
      fieldName: "min_height",
      type: "number",
    },
    {
      label: "Max Height",
      fieldName: "max_height",
      type: "number",
    },
    {
      label: "Min Width",
      fieldName: "min_width",
      type: "number",
    },
    {
      label: "Max Width",
      fieldName: "max_width",
      type: "number",
    },
    {
      label: "Min Sq. Unit for Discount",
      fieldName: "min_size_for_discount",
      type: "number",
    },
    {
      label: "Max Discount(%)",
      fieldName: "max_discount",
      type: "number",
    },
    { label: "Unit Name", fieldName: "unit_name", required: true },
    {
      label: "Allowed Size in Multiples",
      fieldName: "size_in_multiple_of",
      type: "number",
    },
  ];

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>Size Options</Grid>
      <Grid item container spacing={2}>
        {fields.map(({ label, fieldName, type }) => (
          <Grid item size={{ xs: 6 }} key={fieldName}>
            <CustomTextField
              label={label}
              type={type}
              fieldName={fieldName}
              value={sizeOption[fieldName]}
              error={errors[fieldName]}
              helperText={errors[fieldName]}
              onChange={handleFieldChange}
            />
          </Grid>
        ))}
        <Grid item size={{ xs: 4.5 }}>
          <CustomTextField
            label="Default Height Option"
            type="number"
            value={defaultHeight}
            error={errors.defaultHeight}
            helperText={errors.defaultHeight}
            onChange={(fieldName, value) => setDefaultHeight(value)}
            required
          />
        </Grid>
        <Grid item size={{ xs: 4.5 }}>
          <CustomTextField
            label="Default Width Option"
            type="number"
            value={defaultWidth}
            error={errors.defaultWidth}
            helperText={errors.defaultWidth}
            onChange={(fieldName, value) => setDefaultWidth(value)}
            required
          />
        </Grid>
        <Grid item size={{ xs: 3 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            disabled={
              !defaultHeight ||
              !defaultWidth ||
              sizeOption.default_height_options?.length >= 4
            }
            onClick={handleDefaultOptionAdd}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {(sizeOption.default_height_options || []).map((height, index) => (
          <Grid item key={index}>
            <Chip
              label={`${height} * ${sizeOption.default_width_options[index]}`}
              onDelete={() => handleRemoveChip(index)} // Handle removing the chip
              deleteIcon={<CloseIcon fontSize="small" />}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ProductSizeOptions;
