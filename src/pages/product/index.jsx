import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import * as API from "../../utils/api";
import {
  Typography,
  Container,
  Grid2 as Grid,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import DescriptionSection from "../DescriptionSection";
import ProductBannerSection from "./ProductBannerSection";
import ImageUploader from "../../utils/ImageUploader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { setCart } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [isProductLoading, setIsProductLoading] = useState(true);
  const [artWork, setArtWork] = useState();
  const [productConfig, setProductConfig] = useState({
    height: "",
    width: "",
    qty: "",
  });

  const fetchProduct = useCallback(async () => {
    try {
      setIsProductLoading(true);
      const data = await API.fetchProduct(slug);
      setProduct(data.data.product);
    } catch (error) {
      console.log("Failed to fetch Product");
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
      formData.append("cart_item[image]", artWork);
    }

    try {
      const response = await API.addCartItem(formData);
      setCart(response.data);
      navigate("/cart", {
        replace: true,
        state: {
          alert: {
            message: "Item added Successfully.",
            type: "success",
          },
        },
      });
    } catch (error) {
      console.log("Failed to add item in cart");
    }
  };

  const handleImageChange = (image) => {
    if (image) {
      setArtWork(image);
    }
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
            <Grid py={2}>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
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
