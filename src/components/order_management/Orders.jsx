import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OrderList from "./OrderList";
import OrderItems from "./OrderItems";

const Orders = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="tab list example">
          <Tab label="Order List" value="1" />
          <Tab label="Order Items" value="2" />
        </TabList>
        <TabPanel value="1" sx={{ paddingTop: "4px" }}>
          <OrderList />
        </TabPanel>
        <TabPanel value="2" sx={{ paddingTop: "4px" }}>
          <OrderItems />
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default Orders;
