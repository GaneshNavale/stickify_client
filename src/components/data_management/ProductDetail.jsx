import React, { useState } from "react";
import { Typography, Card, CardMedia, CardContent, Fab } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Grid2 import
import EditIcon from "@mui/icons-material/Edit";
import ProductModal from "./ProductModal";

const ProductDetail = ({ product, setProduct, setAlert }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setAlert({ type: "", message: "" });
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedProduct) => {
    if (updatedProduct) {
      setProduct(updatedProduct);
      setAlert({ type: "success", message: "Product Updated Successfully." });
    }

    setIsEditModalOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5" gutterBottom>
          Product
        </Typography>
      </Grid>
      <Card
        sx={{
          display: "flex",
          alignItems: "stretch",
          padding: "20px",
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CardMedia
              component="img"
              image={product.image_url || "/placeholder.png"} // Default if no image
              alt={product.name}
              sx={{
                width: "100%", // Make the image fit its container
                height: "auto", // Maintain aspect ratio
                objectFit: "cover",
                borderRadius: "8px",
                maxHeight: 250, // Set a maximum height for the image
              }}
            />
          </Grid>

          {/* Right Column: Larger Details */}
          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Typography variant="h5" component="div" gutterBottom>
                {product.name}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
                sx={{ flexGrow: 1 }}
              >
                {product.description}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {isEditModalOpen && (
        <ProductModal
          open={isEditModalOpen}
          handleModalClose={handleModalClose}
          selectedProduct={product}
        />
      )}
      <Fab
        color="primary"
        aria-label="edit"
        size="small"
        onClick={handleEditClick}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <EditIcon />
      </Fab>
    </div>
  );
};

export default ProductDetail;
