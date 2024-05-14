import { Box, Typography, useTheme, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useState, useEffect } from 'react';

const Order = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [Orders, SetOrders] = useState([]);
    const [active, setActive] = useState(true);

    useEffect(() => {
        const endpoint = active ? 'http://localhost:8080/orders/active' : 'http://localhost:8080/orders/past';

        fetch(endpoint)
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
            });
    }, [active]);

    const columns = [
        { field: "orderId", headerName: "ID" },
        { field: "orderName", headerName: "Order Name" },
        { field: "orderDescription", headerName: "Order Description" },
        { field: "status", headerName: "Status" },
        { field: "price", headerName: "Price" },
        { field: "cost", headerName: "Cost" },
        { field: "customerName", headerName: "Customer Name" },
        { field: "phoneNumber", headerName: "Phone number" },
        { field: "email", headerName: "Email" },
        { field: "vehicleDetails", headerName: " Vehicle Details" }
    ];

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
        vehicleDetails: order.customer && order.customer.vehicles.length > 0 ?
            `${order.customer.vehicles[0].make} ${order.customer.vehicles[0].model} (${order.customer.vehicles[0].year}) - ${order.customer.vehicles[0].licensePlate}` :
            "N/A"
    }));

    return (
        <Box>
            <Header title="Orders" subtitle="All Orders" />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box
                        onClick={() => setActive(true)}
                        borderRadius={'8px'}
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgcolor={active ? colors.greenAccent[600] : colors.background}
                        color={active ? colors.textPrimary : colors.textSecondary}
                        cursor="pointer"
                    >
                        <Typography variant="button">Active</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        onClick={() => setActive(false)}
                        borderRadius={'8px'}
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgcolor={!active ? colors.greenAccent[600] : colors.background}
                        color={!active ? colors.textPrimary : colors.textSecondary}
                        cursor="pointer"
                    >
                        <Typography variant="button">Past</Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box
                // m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        // backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                        // borderRadius: "8px"
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.orderId}
                />
            </Box>
        </Box>
    );
};

export default Order;
