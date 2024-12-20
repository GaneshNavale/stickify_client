import React, { useState, useEffect } from "react";
import {
  Container,
  Grid2 as Grid,
  Typography,
  TextField,
  Pagination,
  CircularProgress,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Tooltip,
  Button,
  Backdrop,
} from "@mui/material";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "@mui/material/Link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { NavLink, useNavigate } from "react-router-dom";
import * as API from "../utils/api";
import Zoom from "@mui/material/Zoom";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setOpenBackdrop(true);
    try {
      const response = await API.fetchOrders({
        search: searchQuery,
        page,
        per_page: 10,
      });
      setOrders(response.data.orders);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1); // Adjust page number (1-based to 0-based index)
  };

  const shippingAddress = (address) => {
    const addressParts = [
      address.address_line_1,
      address.address_line_2,
      address.landmark,
      address.city,
      address.state,
      address.zip_code,
    ].filter(Boolean); // Filter out empty values

    return (
      <Box p={1}>
        <Typography variant="body1" gutterBottom>
          <strong>{address.full_name}</strong>
        </Typography>
        <Box component="span" sx={{ display: "block", width: "180px" }}>
          <Typography variant="body1">{addressParts.join(", ")}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Container>
      <Grid container display="flex" direction="column" sx={{ px: 7 }}>
        <Grid item py={2}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" color="primary">
                Your Orders
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                placeholder="Search all orders"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Directly update searchQuery
                sx={{
                  borderRadius: "4px",
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
              <Button
                sx={{
                  ml: 1,
                  borderRadius: "20px",
                }}
                onClick={fetchOrders} // Trigger search on button click
                variant="contained"
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Order List using Accordion */}
        {orders.map((order) => (
          <Accordion
            key={order.id}
            sx={{
              borderRadius: "4px",
            }}
            expanded={true} // Disable expand/collapse behavior
          >
            <AccordionSummary
              expandIcon={null}
              aria-controls={`panel-${order.id}-content`}
              id={`panel-${order.id}-header`}
              sx={{
                "backgroundColor": "#eff2f2",
                "&:hover": {
                  cursor: "auto !important", // Prevent the hand pointer on hover
                },
                "userSelect": "text",
              }}
            >
              <Grid
                container
                spacing={{ xs: 2, sm: 3, md: 5, lg: 6 }}
                justifyContent="space-between"
                sx={{ flexGrow: 1 }}
              >
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    ORDER PLACED
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.created_at}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    AMOUNT
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{order.total_price}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Ship To
                  </Typography>
                  <Tooltip
                    title={shippingAddress(order.shipping_address)}
                    TransitionComponent={Zoom}
                    sx={{
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: "#006ce5",
                        color: "white",
                        fontSize: "14px",
                      },
                    }}
                    arrow
                  >
                    <Link
                      as={NavLink}
                      underline="hover"
                      color="#006ce5"
                      variant="body2"
                      sx={{
                        display: "inline-flex",
                        alignItems: "flex-end",
                      }}
                    >
                      {order.shipping_address.full_name}
                      <ArrowDropDownIcon fontSize="small" />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    ORDER # {order.order_id?.toUpperCase()}
                  </Typography>
                  <Link
                    as={NavLink}
                    underline="hover"
                    color="#006ce5"
                    to={`/order_details/${order.order_id}`}
                    variant="body2"
                  >
                    View order details
                  </Link>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#fff" }}>
              <Grid
                container
                spacing={3}
                justifyContent="space-between"
                sx={{ flexGrow: 1, alignItems: "top" }}
              >
                <Grid item>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Items Ordered
                  </Typography>
                  {order.items.map((item) => (
                    <Box key={item.id} sx={{ display: "flex", mb: 3 }}>
                      <Avatar
                        src={item.image_url}
                        alt={item.name}
                        variant="square"
                        sx={{ width: 105, height: 70, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity}, Size: {item.height} *{" "}
                          {item.width}
                        </Typography>
                        <Typography variant="body2">
                          Price: ₹{item.final_price}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Grid>

                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Button variant="outlined" color="primary" size="small">
                      Track order
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() =>
                        navigate(`/order_details/${order.order_id}`)
                      }
                    >
                      View or Edit order
                    </Button>
                    <Button variant="outlined" color="primary" size="small">
                      Cancel order
                    </Button>
                    <Button variant="outlined" color="primary" size="small">
                      Write a product review
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
        {totalPages > 1 && (
          <Box
            display="flex"
            justifyContent="center"
            mt={3}
            sx={{
              backgroundColor: "#ffffff",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "20px",
                },
              }}
            />
          </Box>
        )}
      </Grid>
      <Backdrop open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default UserOrders;
