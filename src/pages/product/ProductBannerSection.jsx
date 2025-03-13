import {
  Box,
  Card,
  Container,
  Grid2 as Grid,
  Rating,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ProductPrice from './ProductPrice';

const ProductBannerSection = ({ product, setProductConfig }) => {
  const navigate = useNavigate();
  const handleClick = (event, routeTo) => {
    event.preventDefault();
    navigate(routeTo);
  };

  return (
    <Box
      py={3}
      sx={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        overflow: 'hidden',
        minHeight: '500px',
        backgroundImage: `url(${process.env.PUBLIC_URL + '/product_banner.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container>
        <Box role="presentation" sx={{ mb: 2 }} px={3}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/"
              onClick={(e) => handleClick(e, '/')}
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href={`/categories/${product.category_slug}`}
              onClick={(e) =>
                handleClick(e, `/categories/${product.category_slug}`)
              }
            >
              {product.category_name}
            </Link>
            <Typography color="text.primary">{product.name}</Typography>
          </Breadcrumbs>
        </Box>
      </Container>

      <Container size="lg">
        <Grid container spacing={2} alignItems="top" px={3}>
          <Grid item size={{ xs: 12, sm: 6, md: 8 }}>
            <Grid container alignItems="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                }}
              >
                {product.name}
              </Typography>
              <Rating
                name="text-feedback"
                value={product.average_rating}
                readOnly
                precision={0.5}
                sx={{ paddingLeft: 2 }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              <Typography sx={{ paddingLeft: 1 }}>
                {product.reviews_count} Reviews
              </Typography>
              <Typography>{product.description}</Typography>
            </Grid>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <ProductPrice
                product={product}
                setProductConfig={setProductConfig}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductBannerSection;