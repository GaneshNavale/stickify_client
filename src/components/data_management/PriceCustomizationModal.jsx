import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid2 as Grid,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";

const PriceCustomizationModal = ({
  open,
  handleClose,
  calculateDiscount,
  quantityOption,
  sizeOption,
  setQuantityOption, // Handler to update quantity option
  setSizeOption, // Handler to update size option
  handleSubmit,
}) => {
  const [size, setSize] = useState({ height: "", width: "" });
  const [discounts, setDiscounts] = useState([]);
  const [calculationInProgress, setCalculationInProgress] = useState(true);

  useEffect(() => {
    if (size.height && size.width) {
      setCalculationInProgress(true);
      const newDiscounts = calculateDiscount(size.height, size.width);
      setDiscounts(newDiscounts); // Store recalculated discounts
      setCalculationInProgress(false);
    }
  }, [size, sizeOption, quantityOption]);

  const handleSizeOptionChange = (key, value) => {
    setSizeOption((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleQuantityOptionChange = (key, value) => {
    setQuantityOption((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Customize Price</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} py={2}>
          <Grid item size={6}>
            <TextField
              label="Height"
              type="number"
              fullWidth
              value={size.height}
              onChange={(e) =>
                setSize({ ...size, height: parseFloat(e.target.value) })
              }
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              label="Width"
              type="number"
              fullWidth
              value={size.width}
              onChange={(e) =>
                setSize({ ...size, width: parseFloat(e.target.value) })
              }
            />
          </Grid>
          <Grid item size={12}>
            <Divider>Size Factor</Divider>
          </Grid>
          <Grid item size={6}>
            <TextField
              label="Exponential Factor"
              type="number"
              fullWidth
              value={sizeOption.exponential_factor}
              onChange={(e) =>
                handleSizeOptionChange(
                  "exponential_factor",
                  parseFloat(e.target.value)
                )
              }
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              label="Increment Factor"
              type="number"
              fullWidth
              value={sizeOption.increment_factor}
              onChange={(e) =>
                handleSizeOptionChange(
                  "increment_factor",
                  parseFloat(e.target.value)
                )
              }
            />
          </Grid>
          <Grid item size={12}>
            <Divider>Quantity Factor</Divider>
          </Grid>
          <Grid item size={6}>
            <TextField
              label="Exponential Factor"
              type="number"
              fullWidth
              value={quantityOption.exponential_factor}
              onChange={(e) =>
                handleQuantityOptionChange(
                  "exponential_factor",
                  parseFloat(e.target.value)
                )
              }
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              label="Increment Factor"
              type="number"
              fullWidth
              value={quantityOption.increment_factor}
              onChange={(e) =>
                handleQuantityOptionChange(
                  "increment_factor",
                  parseFloat(e.target.value)
                )
              }
            />
          </Grid>
          <Grid item size={12}>
            <Typography variant="h6">Discounts for Quantities</Typography>
            <List>
              {discounts.length > 0 &&
                discounts.map((discount, index) => (
                  <ListItem key={index}>
                    <Typography>
                      Quantity {discount.quantity}: {discount.discount}%
                      discount
                    </Typography>
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Back
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Confirm Price
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceCustomizationModal;
