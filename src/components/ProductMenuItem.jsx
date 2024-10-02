import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import * as API from "../utils/api";

const ProductMenuItem = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.listOfAllCategories()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]);
        }
      })
      .catch((error) => {
        setCategories([]);
      });
  }, []);

  const toggleProductMenu = (event) => {
    if (event.type === "mouseenter") {
      setAnchorEl(event.currentTarget);
    } else if (event.type === "mouseleave") {
      setAnchorEl(null);
    }
  };

  const handleProductClick = (category) => {
    setAnchorEl(null);
    navigate("/products/product_listing", {
      state: { categoryId: category.id, categoryName: category.name },
    });
  };

  return (
    <MenuItem
      onMouseEnter={toggleProductMenu}
      onMouseLeave={toggleProductMenu}
      sx={{ display: "inline-block" }}
    >
      <Button sx={{ color: "primary.main" }}>Products</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          onMouseLeave: toggleProductMenu,
        }}
        sx={{ minWidth: 300 }}
      >
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            onClick={() => handleProductClick(category)}
          >
            {category.name}
          </MenuItem>
        ))}
      </Menu>
    </MenuItem>
  );
};

export default ProductMenuItem;
