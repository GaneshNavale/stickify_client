import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import * as API from "../../utils/api";
import { Typography } from "@mui/material";

import DescriptionSection from "../DescriptionSection";
import ProductBannerSection from "./ProductBannerSection";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const { slug } = useParams();

  const [isProductLoading, setIsProductLoading] = useState(true);

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

  return (
    <div>
      <ProductBannerSection product={product} />
      <DescriptionSection
        descriptions={product?.descriptions || []}
        videoThumbnail={product.category_image_url}
      />
    </div>
  );
};

export default Product;
