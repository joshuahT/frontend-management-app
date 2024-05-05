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
    { field: "cost", headerName: "Cost" }];

    return (

        <Box>
            <Header title="Orders" subtitle="All Orders"></Header>
            <Box>
                <DataGrid
                    rows={Orders}
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