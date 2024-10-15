import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid2 as Grid,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as API from "../../utils/adminApi";
import ImageUploader from "../../utils/ImageUploader";
import { useNavigate } from "react-router-dom";
import ProductSizeOptions from "./ProductSizeOptions";
import ProductQuantityOptions from "./ProductQuantityOptions";
import PriceCustomizationModal from "./PriceCustomizationModal";

const ProductModal = (props) => {
  const { open, selectedProduct, handleModalClose } = props;
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [quantityOptionErrors, setQuantityOptionErrors] = useState({});
  const [sizeOptionErrors, setSizeOptionErrors] = useState({});
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [product, setProduct] = useState(initializeProduct(selectedProduct));
  const [sizeOption, setSizeOption] = useState(
    initializeSizeOption(selectedProduct?.size_option)
  );
  const [quantityOption, setQuantityOption] = useState(
    initializeQuantityOption(selectedProduct?.quantity_option)
  );

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    setIsCategoriesLoading(true);
    API.fetchCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log("Failed to fetch categories.");
      })
      .finally(() => {
        setIsCategoriesLoading(false);
      });
  }, []);

  const handleImageChange = (image) => {
    if (image) {
      setProduct({ ...product, image: image });
      let newErrors = { ...errors };
      delete newErrors.image; // Clear image error if an image is selected
      setErrors(newErrors);
    }
  };

  const handleSwitchChange = useCallback((event) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      active: event.target.checked,
    }));
  }, []);

  const validateFields = () => {
    let errors = {};
    let quantityOptionErrors = {};
    let sizeOptionErrors = {};

    const requiredFields = {
      name: product.name,
      description: product.description,
    };

    Object.keys(requiredFields).forEach((field) => {
      if (!requiredFields[field]?.trim()) {
        errors[field] = "is required";
      }
    });

    if (!product.category_id) {
      errors.category = "is required";
    }

    if (!product.price) {
      errors.price = "Price is required";
    } else if (product.price <= 0) {
      errors.price = "Price is Invalid";
    }

    if (!product.image && !product.image_url) {
      errors.image = "Image is required";
    }

    const requiredQuantityFields = [
      "min_quantity",
      "max_quantity",
      "min_quantity_for_discount",
      "max_discount",
      "default_quantity_options",
      "quantity_in_multiple_of",
    ];

    requiredQuantityFields.forEach((field) => {
      if (!quantityOption[field]) {
        quantityOptionErrors[field] = "is required";
      }
    });

    const requiredSizeFields = [
      "min_height",
      "max_height",
      "min_width",
      "max_width",
      "min_size_for_discount",
      "max_discount",
    ];

    requiredSizeFields.forEach((field) => {
      if (!sizeOption[field]) {
        sizeOptionErrors[field] = "is required";
      }
    });

    if (sizeOption.default_height_options.length <= 0) {
      sizeOptionErrors.defaultWidth = "is required";
      sizeOptionErrors.defaultHeight = "is required";
    }

    setErrors(errors);
    setQuantityOptionErrors(quantityOptionErrors);
    setSizeOptionErrors(sizeOptionErrors);

    return (
      Object.keys(errors).length === 0 ||
      Object.keys(quantityOptionErrors).length === 0 ||
      Object.keys(sizeOptionErrors).length === 0
    );
  };

  const handleBlur = (field) => (e) => {
    if (!e.target.value.trim()) {
      setErrors({ ...errors, [field]: `${field} is required` });
    } else {
      let newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const prepareFormData = (formData) => {
    Object.keys(sizeOption).forEach((key) => {
      if (key === "default_width_options" || key === "default_height_options") {
        sizeOption[key].forEach((value) => {
          formData.append(
            `product[size_pricing_rule_attributes][${key}][]`,
            value
          );
        });
      } else {
        formData.append(
          `product[size_pricing_rule_attributes][${key}]`,
          sizeOption[key]
        );
      }
    });

    Object.keys(quantityOption).forEach((key) => {
      if (key === "default_quantity_options") {
        const defaultQuantityOptions = quantityOption[key]
          ?.split(",")
          .map(Number);
        defaultQuantityOptions.forEach((value) => {
          formData.append(
            `product[quantity_pricing_rule_attributes][${key}][]`,
            value
          );
        });
      } else {
        formData.append(
          `product[quantity_pricing_rule_attributes][${key}]`,
          quantityOption[key]
        );
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setOpenBackdrop(true);
    const formData = new FormData();

    prepareFormData(formData);

    formData.append("product[name]", product.name);
    formData.append("product[category_id]", product.category_id);
    formData.append("product[description]", product.description || "");
    formData.append("product[active]", product.active || false);
    formData.append("product[price]", product.price);
    if (product.image) {
      formData.append("product[image]", product.image);
    }

    try {
      const response = selectedProduct
        ? await API.updateProduct(selectedProduct.id, formData)
        : await API.createProduct(formData);

      if (selectedProduct) {
        handleModalClose(response.data.product);
      } else {
        navigate(
          `/admin/data_management/products/${response.data.product.slug}`,
          {
            replace: true,
            state: {
              alert: {
                message: "Product created Successfully.",
                type: "success",
              },
            },
          }
        );
      }
      onClose();
    } catch (error) {
      setAlert({ message: "Failed to save product.", type: "error" });
    } finally {
      setOpenBackdrop(false);
    }
  };

  const onClose = () => {
    handleModalClose();
    setErrors({});
    setSizeOption(initializeSizeOption());
    setQuantityOption(initializeQuantityOption());
    setProduct(initializeProduct());
    setQuantityOptionErrors({});
  };

  const calculateDiscount = (height, width) => {
    // Size discount variables
    const maxSizeDiscount = sizeOption.max_discount;
    const sizeExponentialFactor = sizeOption.exponential_factor || 1;
    const sizeIncrementFactor = sizeOption.increment_factor || 0.01;
    const minSizeForDiscount = sizeOption.min_size_for_discount;

    // Quantity discount variables
    const minQuantityForDiscount = quantityOption.min_quantity_for_discount;
    const maxQuantityDiscount = quantityOption.max_discount;
    const defaultQuantityOptions = quantityOption.default_quantity_options;
    const quantityExponentialFactor = quantityOption.exponential_factor;
    const quantityIncrementalFactor = quantityOption.increment_factor;

    // Map through each quantity option to calculate the final discount
    const pricingWithDiscounts = defaultQuantityOptions
      ?.split(",")
      ?.map((quantity) => {
        // Quantity Discount Calculation
        let qDiscount = 0;
        if (parseInt(quantity) >= parseInt(minQuantityForDiscount)) {
          qDiscount =
            quantityIncrementalFactor *
            Math.log10(quantity) ** quantityExponentialFactor;
          qDiscount = Math.min(maxQuantityDiscount, qDiscount * 100); // Cap it to max discount
        }

        // Size Discount Calculation
        const size = height * width;
        let sDiscount = 0;
        if (size >= minSizeForDiscount) {
          sDiscount =
            sizeIncrementFactor * Math.log10(size) ** sizeExponentialFactor;
          sDiscount = Math.min(sDiscount, maxSizeDiscount * 100); // Cap it to max discount
        }
        // Final Combined Discount
        // Apply the size discount on top of the quantity discount
        const finalDiscount =
          qDiscount + sDiscount * (1 - qDiscount / 100.0) * 100;

        // Return the calculated discount for this quantity
        return {
          quantity,
          discount: finalDiscount.toFixed(2), // Optional: format the discount to 2 decimal places
        };
      });

    return pricingWithDiscounts;
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="new_product">
        {selectedProduct ? "Edit Product" : "New Product"}
        <CloseIcon
          onClick={onClose}
          sx={{ cursor: "pointer", position: "absolute", right: 8, top: 8 }}
        />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} direction="column">
          {/* Image Preview Section */}
          <Grid item>
            <ImageUploader
              imageUrl={selectedProduct?.image_url}
              onImageChange={handleImageChange}
              error={!!errors.image}
              helperText={errors.image}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Name"
              type="text"
              size="small"
              fullWidth
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              onBlur={handleBlur("name")}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item container spacing={2}>
            <Grid item size={{ xs: 3, sm: 2 }} justifyItems="center">
              <InputLabel id="category-id-label">Category</InputLabel>
            </Grid>
            <Grid item size={{ xs: 4 }} alignItems="center">
              {!isCategoriesLoading && (
                <Select
                  labelId="category-id-label"
                  id="category-id-select"
                  value={product.category_id}
                  variant="outlined"
                  size="small"
                  onChange={(e) =>
                    setProduct({ ...product, category_id: e.target.value })
                  }
                  autoWidth
                  error={!!errors.category_id}
                  helperText={errors.category_id}
                  fullWidth
                >
                  {(categories || []).map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.display_name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Grid>
            <Grid item size={{ xs: 5, sm: 6 }} sx={{ paddingBottom: 0.5 }}>
              <TextField
                label="Base Price Per Sq. Unit"
                type="number"
                size="small"
                fullWidth
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                error={!!errors.price}
                helperText={errors.price}
                required
              />
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              label="Description"
              multiline
              size="small"
              rows={3}
              fullWidth
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              onBlur={handleBlur("description")}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Enter description"
              required
            />
          </Grid>
          <ProductSizeOptions
            errors={sizeOptionErrors}
            setErrors={setSizeOptionErrors}
            sizeOption={sizeOption}
            setSizeOption={setSizeOption}
          />
          <ProductQuantityOptions
            errors={quantityOptionErrors}
            setErrors={setQuantityOptionErrors}
            quantityOption={quantityOption}
            setQuantityOption={setQuantityOption}
          />
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={product.active}
                  onChange={handleSwitchChange}
                  color="primary"
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid py={0.5}>
          <Button
            variant="outlined"
            onClick={() => validateFields() && setOpenPriceModal(true)}
            disabled={openBackdrop}
          >
            Customize Price
          </Button>
          <PriceCustomizationModal
            open={openPriceModal}
            handleClose={() => setOpenPriceModal(false)}
            calculateDiscount={calculateDiscount}
            quantityOption={quantityOption}
            sizeOption={sizeOption}
            setQuantityOption={setQuantityOption} // Handler to update quantity option
            setSizeOption={setSizeOption} // Handler to update size option
            handleSubmit={handleSubmit}
          />
        </Grid>
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

const initializeProduct = (product) => ({
  name: product?.name || "",
  category_id: product?.category_id || "",
  description: product?.description || "",
  price: product?.price ? parseFloat(product?.price) : "",
  active: product?.active || false,
  image: null,
  image_url: product?.image_url || "",
});

const initializeSizeOption = (option) => ({
  min_height: option?.min_height || "",
  min_width: option?.min_width || "",
  max_height: option?.max_height || "",
  max_width: option?.max_width || "",
  unit_name: option?.unit_name || "“",
  max_discount: option?.max_discount || "",
  exponential_factor: option?.exponential_factor || 1,
  increment_factor: option?.increment_factor || 0.01,
  size_in_multiple_of: option?.size_in_multiple_of || "",
  default_width_options: option?.default_width_options || [],
  default_height_options: option?.default_height_options || [],
  min_size_for_discount: option?.min_size_for_discount || "",
});

const initializeQuantityOption = (option) => ({
  min_quantity: option?.min_quantity || "",
  max_quantity: option?.max_quantity || "",
  min_quantity_for_discount: option?.min_quantity_for_discount || "",
  max_discount: option?.max_discount || "",
  quantity_in_multiple_of: option?.quantity_in_multiple_of || "",
  exponential_factor: option?.exponential_factor || 1,
  increment_factor: option?.increment_factor || 0.01,
  default_quantity_options: option?.default_quantity_options?.join(",") || "",
});

export default ProductModal;
