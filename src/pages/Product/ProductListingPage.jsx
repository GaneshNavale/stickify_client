import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { useLocation } from "react-router-dom";
import { Divider, Typography } from "@mui/material";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { useState, useEffect } from "react";
import * as API from "../../utils/api";
import ImageDescription from "./ImageDescription";
import VideoDescription from "./VideoDescription";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const ProductListingPage = () => {
  const location = useLocation();
  const { categoryId, categoryName } = location.state || {
    categoryId: null,
    categoryName: "Product",
  };

  const [categoryLoading, setCategoryLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [videoData, setVideoData] = useState({
    videoUrl: "https://www.youtube.com/embed/Nnop2walGmM",
    heading: "Best Song Of Bollywood",
    description:
      "sentences that are organized and coherent, paragraphs. sentences that are organized and coherent, paragraphs. sentences that are organized and coherent, paragraphs.sentences that are organized and coherent, paragraphs.sentences that are organized and coherent, paragraphs.",
  });

  const [imageInfo, setImageInfo] = useState([]);

  useEffect(() => {
    if (categoryId) {
      API.getProductsOfCategory(categoryId)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });

      // get Description images, video for the category
      API.getCategoryDescription(categoryId)
        .then((response) => {
          const descriptions = response?.data?.category?.descriptions;
          setImageInfo(descriptions[0]);
        })
        .catch((error) => {
          console.error("Image Error :", error);
        })
        .finally(() => {
          setCategoryLoading(false);
        });
    }
  }, [categoryId]);

  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{
          marginLeft: 2,
        }}
      >
        <Grid item xs={12} sm={6} md={4} textAlign="center">
          <h1>{categoryName}</h1>
        </Grid>
        <Grid item xs={12} sm={6} md={4} textAlign="center">
          <Box
            sx={{
              width: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Rating
              name="text-feedback"
              value={4.5}
              readOnly
              precision={0.5}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
            />
            <Box sx={{ ml: 2 }}>{labels[4.5]}</Box>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "20px",
        }}
      >
        <Divider
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "100vw",
            transform: "translateX(-50%)",
            backgroundColor: "#000",
            boxShadow: "0px 4px 10px rgba(0.9, 0.9, .9, 0.9)",
            zIndex: 1,
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          {products.length > 0 ? (
            products.map((product) => (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
                key={product.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "90%",
                    height: "90%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    boxShadow: 2,
                    borderRadius: 1,
                    ":hover": {
                      backgroundColor: "#d3d3d3",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={product.image_url}
                    alt={product.name}
                    sx={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: 400,
                    marginTop: 1,
                    textAlign: "center",
                  }}
                >
                  {product.name}
                </Typography>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary">
              No products found.
            </Typography>
          )}
        </Grid>
      </Box>

      <Box>
        <Box sx={{ height: "70px" }} />
        <VideoDescription videoData={videoData} />
        <Box sx={{ height: "70px" }} />
        {!categoryLoading && <ImageDescription imageInfo={imageInfo} />}
      </Box>
    </>
  );
};

export default ProductListingPage;
