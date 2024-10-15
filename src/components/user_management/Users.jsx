import React, { useState, useEffect, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Button, Container, TextField, InputAdornment } from "@mui/material";
import * as API from "../../utils/adminApi";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import UserModal from "./UserModal";
import EditIcon from "@mui/icons-material/Edit";
import Notification from "../../utils/notification";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
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

  const fetchUsers = useCallback(async () => {
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
  }, [paginationModel, queryOptions, searchTerm]);

  const handleEdit = useCallback((params) => {
    setSelectedUser(params.row);
    setOpen(true);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [
    fetchUsers,
    paginationModel.page,
    paginationModel.pageSize,
    queryOptions?.field,
    queryOptions?.sort,
    searchTerm,
  ]);

  const columns = useMemo(
    () => [
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
        minWidth: 130,
        flex: 0.9,
        display: "flex",
        sortable: false,
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 150,
        flex: 1.7,
        sortable: false,
      },
      {
        field: "mobile",
        headerName: "Mobile",
        sortable: false,
        minWidth: 150,
        flex: 0.7,
      },
      {
        field: "is_confirmed",
        headerName: "Confirmed",
        sortable: false,
        minWidth: 85,
        flex: 0.6,
      },
      {
        field: "created_at",
        headerName: "Created On",
        minWidth: 150,
        flex: 0.7,
      },
      {
        field: "sign_in_count",
        headerName: "Sign In Count",
        sortable: false,
        minWidth: 75,
        flex: 0.7,
      },
      {
        field: "actions",
        type: "actions",
        minWidth: 20,
        flex: 0.3,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            onClick={() => {
              handleEdit(params);
            }}
            label="Edit"
          />,
        ],
      },
    ],
    [handleEdit]
  );

  const handleOnSortModelChange = (model) => {
    setQueryOptions(model[0]);
    setSortModel(model);
  };

  return (
    <Container maxWidth="xl">
      <UserModal
        open={open}
        setOpen={setOpen}
        setAlert={setAlert}
        fetchUsers={fetchUsers}
        user={selectedUser}
      />

      <Grid container spacing={2} direction="column">
        <Grid>
          <Notification alert={alert} setAlert={setAlert} />
        </Grid>
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
          <Grid display="flex" size={{ sm: 6, md: 8 }} justifyContent="right">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedUser();
                setOpen(true);
              }}
            >
              New User
            </Button>
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
    </Container>
  );
};

export default Users;
