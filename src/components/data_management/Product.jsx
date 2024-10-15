import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import * as API from "../../utils/adminApi";
import Notification from "../../utils/notification";
import DescriptionList from "./DescriptionList";
import ProductDetail from "./ProductDetail";

const Product = () => {
  const location = useLocation();
  const { slug } = useParams();
  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [descriptions, setDescriptions] = useState([]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const data = await API.fetchProduct(slug);
      setProduct(data.data.product);
      setDescriptions(data.data.product.descriptions);
    } catch (error) {
      console.log("error", error);
      setAlert({ message: "Failed to fetch Product.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg">
      <Notification alert={alert} setAlert={setAlert} />
      {!isLoading && (
        <ProductDetail
          product={product}
          setProduct={setProduct}
          setAlert={setAlert}
        />
      )}
      {!isLoading && (
        <DescriptionList
          id={product.id}
          type="Product"
          descriptions={descriptions}
          setDescriptions={setDescriptions}
          setAlert={setAlert}
        />
      )}
    </Container>
  );
};

export default Product;
