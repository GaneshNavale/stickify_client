import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Container,
  Grid2 as Grid,
  Button,
  Backdrop,
  CircularProgress,
  Box,
  Breadcrumbs,
  Link,
} from '@mui/material';

import DescriptionSection from '../DescriptionSection';
import ProductBannerSection from './ProductBannerSection';
import ImageUploader from '../../utils/ImageUploader';
import ProductReviews from './ProductReviews';
import * as API from '../../utils/api';

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { setCart } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [isProductLoading, setIsProductLoading] = useState(true);
  const [artWork, setArtWork] = useState();
  const [productConfig, setProductConfig] = useState({
    height: '',
    width: '',
    qty: '',
  });

  const fetchProduct = useCallback(async () => {
    try {
      setIsProductLoading(true);
      const data = await API.fetchProduct(slug);
      setProduct(data.data.product);
    } catch (error) {
      console.log('Failed to fetch Product');
    } finally {
      setIsProductLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [slug, fetchProduct]);

  if (isProductLoading) {
    return <Typography>Loading...</Typography>;
  }

  const addToCart = async () => {
    setOpenBackdrop(true);
    let cartItemParams = {
      product_id: product.id,
      height: productConfig.height,
      width: productConfig.width,
      quantity: productConfig.qty,
    };

    const formData = new FormData();

    for (const key in cartItemParams) {
      formData.append(`cart_item[${key}]`, cartItemParams[key]);
    }

    if (artWork) {
      formData.append('cart_item[image]', artWork);
    }

    try {
      const response = await API.addCartItem(formData);
      setCart(response.data);
      navigate('/cart', {
        replace: true,
        state: {
          alert: {
            message: 'Item added Successfully.',
            type: 'success',
          },
        },
      });
    } catch (error) {
      console.log('Failed to add item in cart');
    }
  };

  const handleImageChange = (image) => {
    if (image) {
      setArtWork(image);
    }
  };

  const handleClick = (event, routeTo) => {
    event.preventDefault();
    navigate(routeTo); // Use navigate to change the route
  };

  return (
    <div>
      {(!productConfig.height ||
        !productConfig.width ||
        !productConfig.qty) && (
        <>
          <ProductBannerSection
            product={product}
            setProductConfig={setProductConfig}
          />
          <DescriptionSection
            descriptions={product?.descriptions || []}
            videoThumbnail={product.category_image_url}
          />
          <ProductReviews productId={product?.id} />
        </>
      )}
      {productConfig.height && productConfig.width && productConfig.qty && (
        <Container size="lg">
          <Grid
            container
            spacing={2}
            p={3}
            direction="column"
            textAlign="center"
            alignItems="center"
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
            <Grid py={2}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                Upload your artwork
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 8 }}>
              <ImageUploader onImageChange={handleImageChange} height="350px" />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 8 }}>
              <Button
                size="large"
                fullWidth
                variant="contained"
                disabled={openBackdrop}
                onClick={() => addToCart()}
              >
                Continue
              </Button>
            </Grid>
          </Grid>
          <Backdrop open={openBackdrop}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>
      )}
    </div>
  );
};

export default Product;
