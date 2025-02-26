import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import { Container, TextField, InputAdornment } from '@mui/material';
import * as API from '../../utils/adminApi';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Notification from '../../utils/notification';
import { Link, NavLink } from 'react-router-dom';
import OrderModal from './OrderModal';

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'created_at',
      sort: 'desc',
    },
  ]);

  const [queryOptions, setQueryOptions] = useState({});
  const [state, setState] = useState({
    orders: [],
    totalItems: 0,
    totalPages: 0,
  });

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    API.fetchOrders({
      page: paginationModel.page,
      per_page: paginationModel.pageSize,
      sort_by: queryOptions?.field || 'created_at',
      sort_order: queryOptions?.sort || 'desc',
      search: searchTerm,
    })
      .then((response) => response.data)
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          orders: data.orders,
          perPage: data.per_page,
          totalItems: data.total_items,
          totalPages: data.total_pages,
        }));
        setIsLoading(false);
      });
  }, [paginationModel, queryOptions, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [
    fetchOrders,
    paginationModel.page,
    paginationModel.pageSize,
    queryOptions?.field,
    queryOptions?.sort,
    searchTerm,
  ]);

  const handleCloseModal = () => {
    setOrderId(null);
    setOpenModal(false);
  };

  const handleOpenModal = (orderId) => {
    setOrderId(orderId);
    setOpenModal(true);
  };

  const columns = useMemo(
    () => [
      {
        field: 'order_id',
        headerName: 'ID',
        renderCell: (params) => (
          <Link
            as={NavLink}
            onClick={() => handleOpenModal(params.row.order_id)}
            component="button"
            variant="body2"
            sx={{ alignSelf: 'baseline', textDecoration: 'none' }}
          >
            {params.row.order_id}
          </Link>
        ),
        minWidth: 150,
        flex: 0.5,
        sortable: false,
      },
      {
        field: 'name',
        headerName: 'Full Name',
        minWidth: 150,
        flex: 0.5,
        display: 'flex',
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'status',
        headerName: 'Order Status',
        flex: 0.5,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'total_price',
        headerName: 'Total price',
        sortable: false,
        flex: 0.5,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'created_at',
        headerName: 'Placed On',
        sortable: false,
        flex: 0.5,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'items_count',
        headerName: 'Items Count',
        flex: 0.5,
        align: 'center',
        headerAlign: 'center',
      },
    ],
    []
  );

  const handleOnSortModelChange = (model) => {
    setQueryOptions(model[0]);
    setSortModel(model);
  };

  return (
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
      </Grid>
      <Grid size={{ xs: 12 }}>
        <DataGrid
          initialState={{
            sorting: {
              sortModel: sortModel,
            },
          }}
          rows={state.orders}
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
              variant: 'skeleton',
              noRowsVariant: 'circular-progress',
            },
          }}
        />
      </Grid>
      {orderId && (
        <OrderModal
          open={openModal}
          onClose={handleCloseModal}
          orderId={orderId}
        />
      )}
    </Grid>
  );
};

export default OrderList;
