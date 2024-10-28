import {
  Box,
  Card,
  Container,
  Grid2 as Grid,
  Rating,
  Typography,
} from "@mui/material";
import ProductPrice from "./ProductPrice";
import StarIcon from "@mui/icons-material/Star";

const ProductBannerSection = ({ product }) => {
  return (
    <Box
      py={3}
      sx={{
        position: "relative",
        width: "100%",
        height: "auto",
        overflow: "hidden",
        minHeight: "500px",
        backgroundImage: `url(${process.env.PUBLIC_URL + "/product_banner.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container size="lg">
        <Grid container spacing={2} alignItems="top" px={3}>
          <Grid size={{ xs: 12, sm: 4.3, md: 6, lg: 8 }}>
            <Grid container alignItems="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {product.name}
              </Typography>
              <Rating
                name="text-feedback"
                value={4.5}
                readOnly
                precision={0.5}
                sx={{ paddingLeft: 2 }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              <Typography sx={{ paddingLeft: 1 }}>567 Reviews</Typography>
              <Typography>{product.description}</Typography>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 7.7, md: 6, lg: 4 }}>
            <Card>
              <ProductPrice product={product} />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductBannerSection;
