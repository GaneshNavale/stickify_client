import React, { useState, useEffect, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Button, Container, TextField, InputAdornment } from "@mui/material";
import * as API from "../../utils/adminApi";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Link, NavLink } from "react-router-dom";
import Notification from "../../utils/notification";
import { useNavigate } from "react-router-dom";
import CategoryModal from "./CategoryModal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const navigate = useNavigate();

  const [state, setState] = useState({
    categories: [],
    filteredCategories: [],
  });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await API.fetchCategories();
      setState((prevState) => ({
        ...prevState,
        categories: data.data,
        filteredCategories: data.data, // Initially show all categories
      }));
    } catch (error) {
      setAlert({ message: "Failed to fetch categories.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
            to={`/admin/categories/${params.row.slug}`}
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
        field: "display_name",
        headerName: "Display Name",
        sortable: false,
        minWidth: 130,
        flex: 1,
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

  const handleNewCategoryClose = () => {
    setIsNewModalOpen(false);
  };

  // My Changes From Here
  const [filter, setFilter] = useState("all");

  const handleChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === "all") {
      setState((prevState) => ({
        ...prevState,
        filteredCategories: prevState.categories,
      }));
    } else {
      const isActive = selectedFilter === "active";
      const filteredCategories = state.categories.filter(
        (category) => category.active === isActive
      );
      setState((prevState) => ({
        ...prevState,
        filteredCategories,
      }));
    }
  };

  return (
    <Container maxWidth="xl">
      <CategoryModal
        open={isNewModalOpen}
        handleModalClose={handleNewCategoryClose}
      />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Notification alert={alert} setAlert={setAlert} />
          </Grid>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl sx={{ minWidth: 200 }} fullWidth>
                <InputLabel id="demo-simple-select-label">Select</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filter}
                  label="Filter"
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
                aria-label="Add new category"
              >
                New Category
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              rows={state.filteredCategories}
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

export default Categories;