import { useEffect, useMemo, useState } from 'react';
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
  Stack,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const ProductPrice = ({ product, setProductConfig }) => {
  const [customSize, setCustomSize] = useState({ width: '', height: '' });
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customQuantity, setCustomQuantity] = useState('');
  const [useCustomQuantity, setUseCustomQuantity] = useState(false);
  const [pricingWithDiscounts, setPricingWithDiscounts] = useState([]);
  const [customQuantityDiscount, setCustomQuantityDiscount] = useState({});
  const [size, setSize] = useState({ width: '', height: '' });
  const [errors, setErrors] = useState({ size: '', quantity: '' });

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

  const validateCustomSize = () => {
    const { min_width, max_width, min_height, max_height } =
      product.size_option;
    const { width, height } = customSize;

    if (!width || !height) {
      setErrors((prev) => ({
        ...prev,
        size: 'Width and height are required.',
      }));
      return false;
    }

    if (
      width < min_width ||
      width > max_width ||
      height < min_height ||
      height > max_height
    ) {
      setErrors((prev) => ({
        ...prev,
        size: `• Width Range: ${min_width}-${max_width}
               • Height Range: ${min_height}-${max_height}`,
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, size: '' }));
    return true;
  };

  const validateCustomQuantity = () => {
    const { min_quantity, max_quantity } = product.quantity_option;

    if (!customQuantity) {
      setErrors((prev) => ({ ...prev, quantity: 'Quantity is required.' }));
      return false;
    }

    if (customQuantity < min_quantity || customQuantity > max_quantity) {
      setErrors((prev) => ({
        ...prev,
        quantity: `Quantity must be between ${min_quantity} and ${max_quantity}.`,
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, quantity: '' }));
    return true;
  };

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
            maxQuantityDiscount * 100,
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

    let finalDiscount = qDiscount + sDiscount * (1 - qDiscount / 100.0);

    finalDiscount = Math.min(finalDiscount, maxQuantityDiscount);

    const finalPrice =
      parseFloat(product.price) * area * quantity * (1 - finalDiscount / 100);

    return {
      quantity,
      discount: finalDiscount.toFixed(0),
      finalPrice: finalPrice.toFixed(2),
    };
  };

  useEffect(() => {
    const { min_width, max_width, min_height, max_height } =
      product.size_option;
    const { width, height } = customSize;

    const isSizeValid =
      !useCustomSize ||
      (width >= min_width &&
        width <= max_width &&
        height >= min_height &&
        height <= max_height);

    if (isSizeValid) {
      setPricingWithDiscounts(quantityOptions.map(calculateDiscounts));
      setCustomQuantityDiscount((prev) => prev);
    } else {
      setPricingWithDiscounts((prev) => prev);
    }
  }, [size, customSize, product.price, quantityOptions, useCustomSize]);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
    if (event.target.value === 'customSize') {
      setUseCustomSize(true);
      setCustomSize({ height: '', width: '' });
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
    const selectedValue = event.target.value;

    if (selectedValue !== 'customQuantity') {
      setCustomQuantity('');
      setCustomQuantityDiscount({});
      setErrors((prev) => ({ ...prev, quantity: '' }));
    }
    setSelectedQuantity(selectedValue);
    setUseCustomQuantity(selectedValue === 'customQuantity');
  };

  const handleCustomWidthChange = (event) => {
    setCustomSize((prevSize) => ({
      ...prevSize,
      width: event.target.value,
    }));
  };

  const handleCustomHeightChange = (event) => {
    setCustomSize((prevSize) => ({
      ...prevSize,
      height: event.target.value,
    }));
  };

  const handleCustomQuantityToggle = () => {
    setUseCustomQuantity(!useCustomQuantity);
    if (useCustomQuantity) {
      setSelectedQuantity('');
    } else {
      setCustomQuantity('');
    }
  };

  const handleCustomQuantityChange = (event) => {
    let value = event.target.value;
    setCustomQuantity(value);

    const { min_quantity, max_quantity } = product.quantity_option;
    if (value < min_quantity || value > max_quantity) {
      setErrors((prev) => ({
        ...prev,
        quantity: `Quantity must be between ${min_quantity} and ${max_quantity}.`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, quantity: '' }));
    }
  };

  useEffect(() => {
    const { min_quantity, max_quantity } = product.quantity_option;
    const { min_width, max_width, min_height, max_height } =
      product.size_option;
    const { width, height } = customSize;

    const isQuantityValid =
      customQuantity >= min_quantity && customQuantity <= max_quantity;

    const isSizeValid =
      !useCustomSize ||
      (width >= min_width &&
        width <= max_width &&
        height >= min_height &&
        height <= max_height);

    if (isQuantityValid && isSizeValid) {
      setCustomQuantityDiscount(calculateDiscounts(customQuantity));
    } else {
      setCustomQuantityDiscount((prev) => prev);
    }
  }, [customQuantity, customSize, useCustomSize]);

  const configureProduct = () => {
    if (useCustomSize && !validateCustomSize()) return;
    if (useCustomQuantity && !validateCustomQuantity()) return;

    setProductConfig({
      width: useCustomSize ? customSize.width : size.width,
      height: useCustomSize ? customSize.height : size.height,
      qty: useCustomQuantity ? customQuantity : selectedQuantity,
    });
  };

  return (
    <Grid container spacing={1} p={2} direction="column">
      {/* Size */}
      <Grid>
        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="div"
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
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
                    sx={{ paddingBottom: '6px', paddingTop: '6px' }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label="Width"
                      variant="outlined"
                      size="small"
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
                      error={!!errors.size}
                    />
                    <ClearIcon fontSize="small" />
                    <TextField
                      label="Height"
                      variant="outlined"
                      size="small"
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
                      error={!!errors.size}
                    />
                  </Box>
                  {errors.size && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ marginLeft: 3, marginTop: 0.5 }}
                    >
                      {errors.size}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </RadioGroup>
        </FormControl>
      </Grid>
      {/* Quantity */}
      <Grid>
        <FormLabel
          component="div"
          sx={{ fontWeight: 'bold', color: 'text.primary' }}
        >
          Select Quantity
        </FormLabel>
        <RadioGroup
          aria-label="quantity"
          name="quantity"
          value={useCustomQuantity ? '' : selectedQuantity} // Set value based on custom quantity selection
          onChange={handleQuantityChange}
        >
          {/* Default Quantity Options */}
          {pricingWithDiscounts.map(
            ({ quantity, discount, finalPrice }, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ alignItems: 'center', marginBottom: 1 }}
              >
                {/* Quantity Radio Button */}
                <Box sx={{ width: '30%' }}>
                  <FormControlLabel
                    value={quantity}
                    control={
                      <Radio
                        size="small"
                        sx={{ paddingBottom: '6px', paddingTop: '6px' }}
                      />
                    }
                    label={quantity}
                  />
                </Box>
                {/* Price */}
                <Box
                  sx={{ width: '30%', display: 'flex', alignItems: 'center' }}
                >
                  <CurrencyRupeeIcon fontSize="small" />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    {finalPrice}
                  </Typography>
                </Box>
                {/* Discount */}
                <Box sx={{ width: '30%' }}>
                  {discount && `Save ${discount}%`}
                </Box>
              </Stack>
            )
          )}

          {/* Custom Quantity Option */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', marginBottom: 1 }}
          >
            {/* Custom Quantity Radio Button and Input */}
            <Box sx={{ width: '30%' }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        variant="outlined"
                        value={customQuantity}
                        type="number"
                        slotProps={{
                          htmlInput: {
                            step: product.quantity_option?.min_quantity || 10,
                            min: 0,
                          },
                        }}
                        sx={{
                          'width': 80,
                          '& .MuiInputBase-input': {
                            padding: '2px',
                          },
                        }}
                        onChange={handleCustomQuantityChange}
                        error={!!errors.quantity}
                      />
                    </Box>
                  ) : (
                    'Custom Quantity'
                  )
                }
              />
            </Box>
            {/* Price for Custom Quantity */}
            <Box sx={{ width: '30%', display: 'flex', alignItems: 'center' }}>
              {customQuantityDiscount.finalPrice && (
                <>
                  <CurrencyRupeeIcon fontSize="small" />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    {customQuantityDiscount.finalPrice}
                  </Typography>
                </>
              )}
            </Box>
            {/* Discount for Custom Quantity */}
            <Box sx={{ width: '30%' }}>
              {customQuantityDiscount.discount &&
                `Save ${customQuantityDiscount.discount}%`}
            </Box>
          </Stack>

          {/* Error Message for Custom Quantity */}
          {errors.quantity && (
            <Typography
              variant="caption"
              color="error"
              sx={{ marginTop: 0.5, width: '100%' }}
            >
              {errors.quantity}
            </Typography>
          )}
        </RadioGroup>
      </Grid>
      <Grid>
        <Grid size={6}>
          <Button
            size="large"
            fullWidth
            variant="contained"
            onClick={configureProduct}
          >
            Continue
          </Button>
        </Grid>
        <Grid size={6} textAlign="center" sx={{ paddingTop: 2 }}>
          <Typography>Next: Upload Artwork →</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductPrice;