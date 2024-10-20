import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import * as API from "../../utils/api";
import { Typography } from "@mui/material";

import CategoryHeader from "./CategoryHeader";
import ProductList from "./ProductList";
import DescriptionSection from "../DescriptionSection";

const Category = (props) => {
  const [category, setCategory] = useState();
  const [products, setProducts] = useState([]);
  const { slug } = useParams();

  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);

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
  }, [slug]);

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
      <CategoryHeader category={category} />
      <ProductList products={products} />
      <DescriptionSection
        descriptions={category.descriptions}
        videoThumbnail={category.image_url}
      />
    </div>
  );
};

export default Category;
