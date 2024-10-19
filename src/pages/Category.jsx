import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as API from "../utils/api";
import {
  Box,
  Container,
  Grid2 as Grid,
  Rating,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import StarIcon from "@mui/icons-material/Star";
import VideoPlayer from "../utils/VideoPlayer";

const Category = (props) => {
  const location = useLocation();

  const [category, setCategory] = useState();
  const [products, setProducts] = useState([]);
  const { slug } = useParams();

  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const descriptions = useMemo(() => category?.descriptions || [], [category]);

  const fetchCategory = useCallback(async () => {
    try {
      setIsCategoryLoading(true);
      const data = await API.fetchCategory(slug);
      setCategory(data.data.category);
    } catch (error) {
      console.log("Failed to fetch category");
    } finally {
      setIsCategoryLoading(false);
    }
  }, [slug, location.state?.category]);

  const fetchProducts = useCallback(async () => {
    if (!category?.id) return;
    try {
      setIsProductLoading(true);
      const data = await API.fetchProducts(slug);
      setProducts(data.data);
    } catch (error) {
      console.log("Failed to fetch products.");
    } finally {
      setIsProductLoading(false);
    }
  }, [slug, category?.id]);

  useEffect(() => {
    fetchCategory();
  }, [slug, fetchCategory]);

  useEffect(() => {
    if (category?.id) {
      fetchProducts();
    }
  }, [category?.id, fetchProducts]);

  if (isCategoryLoading || isProductLoading) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <div>
      <Box
        py={3}
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          bgcolor: "primary.main",
        }}
      >
        <Container size="lg">
          <Grid container spacing={2} alignItems="center" px={3}>
            <Grid item size={{ xs: 12, sm: 9, md: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {category.name}
              </Typography>

              <Typography
                sx={{
                  color: "#fff",
                }}
              >
                {category.description}
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, sm: 3, md: 4 }}>
              <Grid
                container
                justifyContent={{ xs: "center", sm: "flex-end" }}
                spacing={{ xs: 2, sm: 0, md: 1, lg: 2 }}
              >
                <Grid item>
                  <Rating
                    name="text-feedback"
                    value={4.5}
                    readOnly
                    precision={0.5}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                </Grid>
                <Grid>
                  <Typography sx={{ marginBottom: 0.5, color: "#fff" }}>
                    567 Reviews
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container size="lg">
        <Grid container py={3} spacing={3} justifyContent="center">
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item key={product.id}>
                <Card
                  sx={{
                    width: 233, // Set a fixed width
                    height: 300,
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image_url}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        noWrap
                        color="#373737"
                        align="center"
                      >
                        {product.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary">
              No products found.
            </Typography>
          )}
        </Grid>
      </Container>
      <Container size="lg">
        <Grid container display="flex">
          {(descriptions || []).map((description) =>
            description.media_type === "image" ||
            description.media_type === "none" ? (
              <Grid
                container
                spacing={2}
                justifyContent="center"
                justifyItems="center"
              >
                <Grid px={{ xs: 2, md: 2, lg: 3, lx: 4 }}>
                  <CardContent>
                    <Typography
                      variant="h4"
                      component="div"
                      paddingBottom={2}
                      gutter
                      align="center"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {description.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutter>
                      {description.body}
                    </Typography>
                  </CardContent>
                </Grid>
                {/* Image List with Quilted Layout */}
                <Grid
                  justifyContent="center"
                  px={{ xs: 2, md: 3, lg: 4, lx: 5 }}
                >
                  <ImageList
                    variant="quilted"
                    cols={3} // Total 4 columns for quilted layout
                    gap={10}
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "10px",
                    }}
                  >
                    {description.images.map((image, index) => (
                      <ImageListItem
                        key={image.id}
                        cols={index === 0 ? 2 : 1} // 1st image spans 2 columns
                        rows={index === 0 ? 2 : 1} // 1st image spans 2 rows
                      >
                        <img
                          src={image.url}
                          alt={`${image.id}`}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={1} alignItems="center">
                <Grid
                  item
                  size={{ xs: 12, md: 6 }}
                  paddingLeft={{ xs: 2, md: 3, lg: 4, lx: 5 }}
                >
                  <VideoPlayer
                    videoSrc={description.video?.url}
                    videoThumbnail={category.image_url}
                  />
                </Grid>
                <Grid
                  item
                  size={{ xs: 12, md: 6 }}
                  paddingRight={{ xs: 2, md: 3, lg: 4, lx: 5 }}
                >
                  <CardContent>
                    <Typography
                      variant="h4"
                      color="primary"
                      component="div"
                      gutter
                      align="center"
                      sx={{ fontWeight: "bold" }}
                      paddingBottom={2}
                    >
                      {description.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutter>
                      {description.body}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            )
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default Category;
