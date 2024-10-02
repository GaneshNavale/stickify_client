import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useLocation } from "react-router-dom";
import { Divider, Typography } from "@mui/material";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { useState, useEffect } from "react";
import * as API from "../../utils/api";
import ImageDescription from "./ImageDescription";
import VideoDescription from "./VideoDescription";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [videoData, setVideoData] = useState({
    videoUrl: "https://www.youtube.com/embed/Nnop2walGmM",
    heading: "Best Song Of Bollywood",
    description:
      "sentences that are organized and coherent, paragraphs. sentences that are organized and coherent, paragraphs. sentences that are organized and coherent, paragraphs.sentences that are organized and coherent, paragraphs.sentences that are organized and coherent, paragraphs.",
  });

  const [imageInfo, setImageInfo] = useState([]);
  const [prodDescription, setprodDescription] = useState("");

  useEffect(() => {
    if (categoryId) {
      API.getProductsOfCategory(categoryId)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });

      API.getCategoryDescription(categoryId)
        .then((response) => {
          const descriptions = response?.data?.category?.descriptions;
          setprodDescription(response.data.category.description);
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

  const handleProductClick = (product) => {
    navigate("/products/product_info", { state: { product } });
  };

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          backgroundColor: "primary.main",
          paddingTop: 3,
          paddingBottom: 3,
          color: "#f1f1ff",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{
              marginLeft: 3,
            }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                marginLeft: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {categoryName}
              </Typography>

              <Typography
                sx={{
                  textAlign: "left",
                  marginTop: "8px",
                  color: "#d3d3d3",
                }}
              >
                {prodDescription}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
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
        </Box>
      </Box>

      <Box
        sx={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          backgroundColor: "#f3f3f3",
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: 2,
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            {products.length > 0 ? (
              products.map((product) => (
                <Grid
                  item
                  size={{
                    xs: 6,
                    sm: 4,
                    md: 3,
                    lg: 2.4,
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
                    onClick={() => handleProductClick(product)}
                    sx={{
                      width: "100%",
                      padding: 1,
                      height: "auto",
                      overflow: "hidden",
                      cursor: "pointer",
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
                        width: "100%",
                        height: "auto",
                        transition: "background-color 0.3s ease",
                      }}
                    />

                    <Typography
                      sx={{
                        textAlign: "center",
                        marginTop: "8px",
                      }}
                    >
                      {product.name}
                    </Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="text.secondary">
                No products found.
              </Typography>
            )}
          </Grid>
        </Box>
      </Box>

      <Box>
        <Box sx={{ height: "70px" }} />
        <VideoDescription videoData={videoData} />
        <Box sx={{ height: "70px" }} />
        {!categoryLoading && (
          <>
            <Divider />
            <ImageDescription imageInfo={imageInfo} />
          </>
        )}
      </Box>
    </>
  );
};

export default ProductListingPage;
