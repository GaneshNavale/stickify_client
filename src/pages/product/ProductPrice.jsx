import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

const ProductPrice = ({ product }) => {
  console.log("Product :", product);
  const [customSize, setCustomSize] = useState({ width: "", height: "" });
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(
    product.quantity_option.min_quantity
  );
  const [widthError, setWidthError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [useCustomQuantity, setUseCustomQuantity] = useState(false);
  const [pricingWithDiscounts, setPricingWithDiscounts] = useState([]);
  const [customQuantityDiscount, setCustomQuantityDiscount] = useState({});
  const [size, setSize] = useState({ width: "", height: "" });
  const [quantityError, setQuantityError] = useState("");

  const sizeOptions = useMemo(() => {
    return product.size_option.default_width_options.map((width, index) => ({
      width,
      height: product.size_option.default_height_options[index],
    }));
  }, [product.size_option]);

  const quantityOptions = useMemo(() => {
    return product.quantity_option.default_quantity_options;
  }, [product.quantity_option]);
  const [selectedSize, setSelectedSize] = useState(
    `${sizeOptions[0].width} * ${sizeOptions[0].height}`
  );
  const [selectedQuantity, setSelectedQuantity] = useState(quantityOptions[0]);

  useEffect(() => {
    const defaultSize = sizeOptions[0];
    setSize({
      width: parseFloat(defaultSize.width),
      height: parseFloat(defaultSize.height),
    });
  }, [sizeOptions]);

  // Calculate price and discounts for each quantity
  const calculateDiscounts = (quantity) => {
    const {
      max_discount: maxSizeDiscount,
      exponential_factor: sizeExpFactor = 1,
      increment_factor: sizeIncFactor = 0.01,
      min_size_for_discount: minSizeDiscount,
    } = product.size_option;

    const {
      min_quantity_for_discount: minQuantityDiscount,
      max_discount: maxQuantityDiscount,
      exponential_factor: quantityExpFactor,
      increment_factor: quantityIncFactor,
    } = product.quantity_option;

    const area = useCustomSize
      ? customSize.height * customSize.width
      : size.height * size.width;
    const qDiscount =
      quantity >= minQuantityDiscount
        ? Math.min(
            maxQuantityDiscount,
            quantityIncFactor * Math.log10(quantity) ** quantityExpFactor * 100
          )
        : 0;

    const sDiscount =
      area >= minSizeDiscount
        ? Math.min(
            maxSizeDiscount * 100,
            sizeIncFactor * Math.log10(area) ** sizeExpFactor * 100
          )
        : 0;

    const finalDiscount = qDiscount + sDiscount * (1 - qDiscount / 100.0);
    const finalPrice =
      parseFloat(product.price) * quantity * (1 - finalDiscount / 100);

    return {
      quantity,
      discount: finalDiscount.toFixed(0),
      finalPrice: finalPrice.toFixed(2),
    };
  };

  useEffect(() => {
    if (!useCustomSize || (customSize.height && customSize.width)) {
      setPricingWithDiscounts(quantityOptions.map(calculateDiscounts));
    }
  }, [size, customSize, product.price, quantityOptions]);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
    if (event.target.value === "customSize") {
      setUseCustomSize(true);
      setCustomSize({ height: "", width: "" });
    } else {
      setUseCustomSize(false);
      const selectedSizeObj = sizeOptions.find(
        (option) => `${option.width} * ${option.height}` === event.target.value
      );
      if (selectedSizeObj) {
        setSize({
          width: parseFloat(selectedSizeObj.width),
          height: parseFloat(selectedSizeObj.height),
        });
      }
    }
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
    setUseCustomQuantity(event.target.value === "customQuantity");
  };

  const handleCustomWidthChange = (event) => {
    if (event.target.value < product.size_option.min_width) {
      setWidthError(`Width Cant Be Less Than ${product.size_option.min_width}`);
    } else if (event.target.value > product.size_option.max_width) {
      setWidthError(`Width Cant Be More Than ${product.size_option.max_width}`);
    } else {
      setWidthError("");
      setCustomSize((prevSize) => ({
        ...prevSize,
        width: event.target.value,
      }));
    }
  };

  const handleCustomHeightChange = (event) => {
    if (event.target.value < product.size_option.min_height) {
      setHeightError(
        `Height Cant Be Less Than ${product.size_option.min_height}`
      );
    } else if (event.target.value > product.size_option.max_height) {
      setHeightError(
        `Height Cant Be More Than ${product.size_option.max_height}`
      );
    } else {
      setHeightError("");
      setCustomSize((prevSize) => ({
        ...prevSize,
        height: event.target.value,
      }));
    }
  };

  const handleCustomQuantityToggle = () => {
    setUseCustomQuantity(!useCustomQuantity);
    if (useCustomQuantity) {
      setSelectedQuantity(""); // Clear selected quantity when toggling to custom quantity
    } else {
      setCustomQuantity("");
    }
  };

  const customQuantityHandle = (event) => {
    if (event.target.value < product.quantity_option.min_quantity) {
      setQuantityError(
        `Quantity Cant Be Less Than ${product.quantity_option.min_quantity}`
      );
    } else if (event.target.value > product.quantity_option.max_quantity) {
      setQuantityError(
        `Quantity Cant Be More Than ${product.quantity_option.max_quantity}`
      );
    } else {
      setQuantityError("");
      setCustomQuantity(event.target.value);
    }
  };

  useEffect(() => {
    if (
      customQuantity &&
      (!useCustomSize || (customSize.height && customSize.width))
    ) {
      setCustomQuantityDiscount(calculateDiscounts(customQuantity));
    }
  }, [customQuantity, customSize]);

  return (
    <Grid container spacing={1} p={2} direction="column">
      <Grid>
        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="div"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Select Size
          </FormLabel>
          <RadioGroup
            aria-label="size"
            name="size"
            value={selectedSize}
            onChange={handleSizeChange}
          >
            {sizeOptions.map((size, index) => (
              <FormControlLabel
                key={index}
                value={`${size.width} * ${size.height}`}
                control={
                  <Radio
                    size="small"
                    sx={{ paddingBottom: "6px", paddingTop: "6px" }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {size.width}″
                    <ClearIcon sx={{ marginX: 0.2, fontSize: 15 }} />
                    {size.height}″
                  </Box>
                }
                disabled={useCustomQuantity && !customQuantity} // Disable when custom size is selected
              />
            ))}
            {/* Custom Size Radio Button */}
            <FormControlLabel
              disabled={useCustomQuantity && !customQuantity}
              value="customSize"
              control={<Radio size="small" checked={useCustomSize} />}
              label="Custom Size"
            />
            {useCustomSize && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label="Width"
                  variant="outlined"
                  size="small"
                  error={!!widthError} // Show error state
                  helperText={widthError}
                  type="number"
                  value={customSize.width}
                  onChange={handleCustomWidthChange}
                  disabled={useCustomQuantity && !customQuantity}
                  slotProps={{
                    htmlInput: {
                      step: product.size_option?.size_in_multiple_of || 10,
                      min: 0,
                    },
                  }}
                  sx={{
                    width: 100,
                    marginRight: 1,
                    marginLeft: 3,
                  }}
                />
                <ClearIcon fontSize="small" />
                <TextField
                  label="Height"
                  variant="outlined"
                  size="small"
                  error={!!heightError} // Show error state
                  helperText={heightError}
                  type="number"
                  value={customSize.height}
                  disabled={useCustomQuantity && !customQuantity}
                  onChange={handleCustomHeightChange}
                  slotProps={{
                    htmlInput: {
                      step: product.size_option?.size_in_multiple_of || 10,
                      min: 0,
                    },
                  }}
                  sx={{
                    width: 100,
                    marginRight: 2,
                    marginLeft: 1,
                  }}
                />
              </Box>
            )}
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid>
        <FormLabel
          component="div"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Select Quantity
        </FormLabel>
        <RadioGroup
          aria-label="quantity"
          name="quantity"
          value={useCustomQuantity ? "" : selectedQuantity} // Set value based on custom quantity selection
          onChange={handleQuantityChange}
        >
          <Grid container>
            {pricingWithDiscounts.map(
              ({ quantity, discount, finalPrice }, index) => (
                <Grid size={12} container key={index}>
                  <Grid size={5}>
                    <FormControlLabel
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      value={quantity}
                      control={
                        <Radio
                          size="small"
                          sx={{ paddingBottom: "6px", paddingTop: "6px" }}
                        />
                      }
                      label={quantity}
                    />
                  </Grid>
                  <Grid
                    size={3}
                    sx={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    {finalPrice}
                  </Grid>
                  <Grid
                    size={4}
                    sx={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    {discount && `Save ${discount}%`}
                  </Grid>
                </Grid>
              )
            )}
            <Grid size={5}>
              <FormControlLabel
                value="customQuantity"
                control={
                  <Radio
                    size="small"
                    checked={useCustomQuantity}
                    onChange={handleCustomQuantityToggle}
                  />
                }
                label={
                  useCustomQuantity ? (
                    <TextField
                      variant="outlined"
                      value={customQuantity}
                      type="number"
                      error={!!quantityError} // Show error state
                      helperText={quantityError} // Display error message
                      slotProps={{
                        htmlInput: {
                          step: product.quantity_option?.min_quantity || 10,
                          min: 0,
                        },
                      }}
                      sx={{
                        width: 80,
                        "& .MuiInputBase-input": {
                          padding: "2px", // Remove padding here
                        },
                      }}
                      onChange={customQuantityHandle}
                    />
                  ) : (
                    "Custom Quantity"
                  )
                }
              />
            </Grid>
            {useCustomQuantity && (
              <>
                <Grid
                  size={3}
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                  {customQuantityDiscount.finalPrice}
                </Grid>
                <Grid
                  size={4}
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                  {customQuantityDiscount.discount &&
                    `Save ${customQuantityDiscount.discount}%`}
                </Grid>
              </>
            )}
          </Grid>
        </RadioGroup>
      </Grid>
      <Grid>
        <Button size="large" fullWidth variant="contained">
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProductPrice;
