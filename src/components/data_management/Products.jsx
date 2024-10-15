import React, { useState, useEffect, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Button, Container } from "@mui/material";
import * as API from "../../utils/adminApi";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Link, NavLink } from "react-router-dom";
import Notification from "../../utils/notification";
import ProductModal from "./ProductModal";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Products = () => {
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState();
  const [state, setState] = useState({
    products: [],
  });

  const fetchProducts = useCallback(async (filter) => {
    setIsLoading(true);
    try {
      const data = await API.fetchProducts({ filter });
      setState((prevState) => ({
        ...prevState,
        products: data.data,
      }));
      setSelectedProduct(data.data[0]);
    } catch (error) {
      setAlert({ message: "Failed to fetch products.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filter);
  }, [fetchProducts, filter]);

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        maxWidth: 70,
        flex: 0.4,
        sortable: false,
      },
      {
        field: "name",
        renderCell: (params) => (
          <Link
            as={NavLink}
            to={`/admin/data_management/products/${params.row.slug}`}
            component="button"
            variant="body2"
            sx={{ alignSelf: "baseline", textDecoration: "none" }}
          >
            {params.row.name}
          </Link>
        ),
        minWidth: 130,
        flex: 1,
        display: "flex",
        sortable: false,
      },
      {
        field: "slug",
        headerName: "Slug",
        minWidth: 120,
        flex: 1,
        sortable: false,
      },
      {
        field: "category_name",
        headerName: "Category",
        minWidth: 120,
        flex: 1,
        sortable: false,
      },
      {
        field: "active",
        headerName: "Active",
        sortable: false,
        maxWidth: 90,
        flex: 0.6,
      },
    ],
    []
  );

  const handleNewProductClose = () => {
    setIsNewModalOpen(false);
  };

  const handleChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
  };

  return (
    <Container maxWidth="xl">
      <ProductModal
        open={isNewModalOpen}
        handleModalClose={handleNewProductClose}
      />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Notification alert={alert} setAlert={setAlert} />
          </Grid>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl sx={{ minWidth: 200 }} fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filter}
                  size="small"
                  onChange={handleChange}
                >
                  <MenuItem value={"all"}>All</MenuItem>
                  <MenuItem value={"active"}>Active</MenuItem>
                  <MenuItem value={"inactive"}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={8}
              container
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setIsNewModalOpen(true);
                }}
                aria-label="Add new product"
              >
                New Product
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              rows={state.products}
              columns={columns}
              loading={isLoading}
              disableColumnFilter
              hideFooter
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Products;
