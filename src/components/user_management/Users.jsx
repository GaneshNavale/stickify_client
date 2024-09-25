import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Container } from "@mui/material";
import * as API from "../../utils/adminApi";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Input, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  const [sortModel, setSortModel] = React.useState([
    {
      field: "created_at",
      sort: "desc",
    },
  ]);

  const [queryOptions, setQueryOptions] = useState({});
  const [state, setState] = useState({
    users: [],
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    setIsLoading(true);
    API.users({
      page: paginationModel.page,
      per_page: paginationModel.pageSize,
      sort_by: queryOptions?.field || "created_at",
      sort_order: queryOptions?.sort || "desc",
      search: searchTerm,
    })
      .then((response) => response.data)
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          users: data.users,
          perPage: data.per_page,
          totalItems: data.total_items,
          totalPages: data.total_pages,
        }));
        setIsLoading(false);
      });
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    queryOptions?.field,
    queryOptions?.sort,
    searchTerm,
  ]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      maxWidth: 50,
      flex: 0.35,
      sortable: false,
    },
    {
      field: "name",
      headerName: "Full Name",
      minWidth: 150,
      flex: 1,
      display: "flex",
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "is_confirmed",
      headerName: "Confirmed",
      sortable: false,
      minWidth: 75,
      flex: 0.5,
    },
    {
      field: "created_at",
      headerName: "Created On",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "sign_in_count",
      headerName: "Sign In Count",
      sortable: false,
      minWidth: 75,
      flex: 0.7,
    },
  ];
  const handleOnSortModelChange = (model) => {
    setQueryOptions(model[0]);
    setSortModel(model);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} direction="column">
          <Grid container spacing={2} justifyContent="space-between">
            <Grid display="flex" size={{ sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                minWidth="100px"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DataGrid
              initialState={{
                sorting: {
                  sortModel: sortModel,
                },
              }}
              rows={state.users}
              columns={columns}
              loading={isLoading}
              rowCount={state.totalItems}
              sortingMode="server"
              paginationMode="server"
              sortModel={sortModel}
              onSortModelChange={handleOnSortModelChange}
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableColumnFilter
              slotProps={{
                loadingOverlay: {
                  variant: "skeleton",
                  noRowsVariant: "circular-progress",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Users;
