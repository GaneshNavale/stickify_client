import {
  Container,
  Grid2 as Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductList = ({ products }) => {
  const navigate = useNavigate();

  return (
    <Container size="lg">
      <Grid container py={3} spacing={3} justifyContent="center">
        {products.length > 0 ? (
          products.map((product) => (
            <Grid key={product.id}>
              <Card
                sx={{
                  width: 233, // Set a fixed width
                  height: 300,
                }}
                onClick={() => {
                  navigate(`/products/${product.slug}`);
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
  );
};

export default ProductList;
