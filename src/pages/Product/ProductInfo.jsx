import * as API from "../../utils/api";
import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const ProductInfo = () => {
  const location = useLocation();
  const { product } = location.state || {};
  //   we will call an api here to get all information of the specific product

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }
  return (
    <>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4">{product.name}</Typography>
        <Box
          component="img"
          src={product.image_url}
          alt={product.name}
          sx={{ width: "100%", maxWidth: 600, marginTop: 2 }}
        />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Price: ${product.price}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
          Created at: {product.created_at}
        </Typography>
      </Box>
    </>
  );
};

export default ProductInfo;
