import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import OrdersDisplay from "../../components/OrdersActive";
import React, { useState, useEffect } from 'react';


const Order = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [Orders, SetOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/orders/active')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                SetOrders(data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            })
    })

    const columns = [{ field: "orderId", headerName: "ID" },
    { field: "orderName", headerName: "Order Name" },
    { field: "orderDescription", headerName: "Order Description" },
    { field: "status", headerName: "Status" },
    { field: "price", headerName: "Price" },
    { field: "cost", headerName: "Cost" },
    { field: "customerName", headerName: "Customer Name" },
    { field: "phoneNumber", headerName: "Phone number" },
    { field: "email", headerName: "Email" },
    { field: "vehicleDetails", headerName: " Vehicle Details" }];

    const rows = Orders.map(order => ({
        orderId: order.orderId,
        orderName: order.orderName,
        orderDescription: order.orderDescription,
        status: order.status ? "InActive" : "Active",
        price: order.price || "N/A",
        cost: order.cost || "N/A",
        customerName: order.customer ? order.customer.name : "N/A",
        phoneNumber: order.customer ? order.customer.phoneNumber : "N/A",
        email: order.customer ? order.customer.email : "N/A",
        vehicleDetails: order.customer && order.customer.vehicles.length > 0 ? // Extract vehicle details
            `${order.customer.vehicles[0].make} ${order.customer.vehicles[0].model} (${order.customer.vehicles[0].year}) - ${order.customer.vehicles[0].licensePlate}` :
            "N/A",
    }));

    return (

        <Box>
            <Header title="Orders" subtitle="All Orders"></Header>
            <Box>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.orderId}
                />
            </Box>
        </Box>

        // <div>
        //     <OrdersDisplay />
        // </div>
    )
}

export default Order;