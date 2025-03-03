import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import { TextField, InputAdornment } from '@mui/material';
import * as API from '../../utils/adminApi';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Notification from '../../utils/notification';
import { Link, NavLink } from 'react-router-dom';
import OrderItemModal from './OrderItemModal';

const OrderItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [itemId, setItemId] = useState();
  const [openModal, setOpenModal] = useState();
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
    order_items: [],
    totalItems: 0,
    totalPages: 0,
  });

  const fetchOrderItems = useCallback(async () => {
    setIsLoading(true);
    API.fetchOrderItems({
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
          order_items: data.order_items,
          perPage: data.per_page,
          totalItems: data.total_items,
          totalPages: data.total_pages,
        }));
        setIsLoading(false);
      });
  }, [paginationModel, queryOptions, searchTerm]);

  useEffect(() => {
    fetchOrderItems();
  }, [
    fetchOrderItems,
    paginationModel.page,
    paginationModel.pageSize,
    queryOptions?.field,
    queryOptions?.sort,
    searchTerm,
  ]);

  const handleOpenModal = (id) => {
    setItemId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setItemId(null);
    setOpenModal(false);
  };

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        renderCell: (params) => (
          <Link
            as={NavLink}
            onClick={() => handleOpenModal(params.row.id)}
            component="button"
            variant="body2"
            sx={{ alignSelf: 'baseline', textDecoration: 'none' }}
          >
            {params.row.id}
          </Link>
        ),
        minWidth: 20,
        maxWidth: 60,
        align: 'center',
        headerAlign: 'center',
        flex: 0.5,
        sortable: false,
      },
      {
        field: 'order_id',
        headerName: 'Order ID',
        renderCell: (params) => <>#{params.row.order_id}</>,
        minWidth: 100,
        flex: 0.5,
        sortable: false,
      },
      {
        field: 'customer_name',
        headerName: 'Customer',
        minWidth: 150,
        flex: 0.5,
        display: 'flex',
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'product_name',
        headerName: 'Item',
        minWidth: 150,
        flex: 0.5,
        display: 'flex',
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'height',
        headerName: 'Height * Width',
        renderCell: (params) => (
          <>
            {params.row.height} * {params.row.width}
          </>
        ),
        minWidth: 130,
        flex: 0.2,
        display: 'flex',
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        minWidth: 50,
        flex: 0.25,
        display: 'flex',
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.5,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'artwork',
        headerName: 'Artwork',
        flex: 0.25,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'price',
        headerName: 'Price',
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
          rows={state.order_items}
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
      {itemId && (
        <OrderItemModal
          open={openModal}
          onClose={handleCloseModal}
          itemId={itemId}
        />
      )}
    </Grid>
  );
};

export default OrderItems;
