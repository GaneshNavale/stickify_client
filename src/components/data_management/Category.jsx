import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import * as API from "../../utils/adminApi";
import Notification from "../../utils/notification";
import CategoryDetail from "./CategoryDetail";
import DescriptionList from "./DescriptionList";

const Category = () => {
  const location = useLocation();
  const { slug } = useParams();
  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });

  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [descriptions, setDescriptions] = useState([]);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const data = await API.fetchCategory(slug);
      setCategory(data.data.category);
      setDescriptions(data.data.category.descriptions);
    } catch (error) {
      setAlert({ message: "Failed to fetch category.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [slug]);


  if (isLoading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg">
      <Notification alert={alert} setAlert={setAlert} />
      {!isLoading && (
        <CategoryDetail
          category={category}
          setCategory={setCategory}
          setAlert={setAlert}
        />
      )}
      {!isLoading && (
        <DescriptionList
          id={category.id}
          type="Category"
          descriptions={descriptions}
          setDescriptions={setDescriptions}
          setAlert={setAlert}
        />
      )}
    </Container>
  );
};

export default Category;
