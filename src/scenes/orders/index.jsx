import { Box, Typography, useTheme, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useState, useEffect } from 'react';

const Order = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [Orders, SetOrders] = useState([]);
    const [active, setActive] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [customer, setCustomer] = useState([]);
    const [formData, setFormData] = useState({
        orderName: '',
        orderDescription: '',
        price: '',
        cost: '',
        selectedCustomer: '',
        selectedVehicle: '',
    });
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
    });
    const [newVehicle, setNewVehicle] = useState({
        make: '',
        model: '',
        year: '',
        licensePlate: '',
    })

    const [openAddCustomer, setOpenAddCustomer] = useState(false);
    const [openAddVehicle, setOpenAddVehicle] = useState(false);

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

    useEffect(() => {
        fetch('http://localhost:8080/customer/allWithVehicles')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCustomer(data);
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
            })
    }, []);

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

    const handleAddOrder = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const handleCustomerChange = (event) => {
        const customerId = event.target.value;
        if (customerId === 'new') {
            setOpenAddDialog(false);
            setOpenAddCustomer(true);
        } else {
            const selectedCustomer = customer.find(customer => customer.customerId === parseInt(customerId))
            console.log(selectedCustomer);
            setFormData({
                ...formData,
                selectedCustomer: selectedCustomer,
                selectedVehicle: '',
            });
        }
    };

    const handleVehicleChange = (event) => {
        const vehicleId = event.target.value;
        if (vehicleId === 'new') {
            setOpenAddDialog(false);
            setOpenAddVehicle(true);
        } else {
            setFormData({
                ...formData,
                selectedVehicle: vehicleId
            });
        }
    };

    // this should work and add the customer 
    const handleAddCustomerSubmit = () => {
        fetch('http://localhost:8080/customer/createOrUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer),
        })
            .then(response => response.json())
            .then(data => {
                const newCustomerData = { ...data, vehicles: data.vehicles || [] };
                setCustomer([...customer, newCustomerData]);
                setOpenAddCustomer(false);
                setOpenAddDialog(true);
            })
            .catch(error => {
                console.error('Error adding customer', error);
            });
    };

    // this vehicle might not work, might have to refactor how we define the customer and vehicle relationship
    // we want customer to have a list of vehicles
    // we need to create an endpoint for this, might have to remove vehicle in the json order response

    const handleAddVehicleSubmit = () => {

        const customerId = formData.selectedCustomer.customerId;
        const vehicleData = { ...newVehicle, customerId };

        fetch("http://localhost:8080/vehicles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vehicleData),
        })
            // still doesn't work 

            // doesn't go through 
            .then((response) => response.json())
            .then((data) => {
                const customerId = formData.selectedCustomer.customerId;
                const updatedCustomers = customer.map((cust) =>
                    cust.customerId === customerId
                        ? { ...cust, vehicles: [...cust.vehicles, data] }
                        : cust
                );
                setCustomer(updatedCustomers);
                setFormData((prevData) => ({
                    ...prevData,
                    selectedCustomer: updatedCustomers.find(cust => cust.customerId === customerId)
                }));
                setOpenAddVehicle(false);
                setOpenAddDialog(true);
            })
            .catch((error) => {
                console.error("Error adding vehicle", error);
            });

    };

    const handleAddOrderSubmit = () => {

        const orderData = { ...formData, }
    }





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
            <Button variant="contained" color="primary" onClick={handleAddOrder}>
                Add New Order
            </Button>
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <DialogTitle>Add New Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Order Name"
                        type="text"
                        fullWidth
                        value={formData.orderName}
                        onChange={(event) => setFormData({ ...formData, orderName: event.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Order Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.orderDescription}
                        onChange={(event) => setFormData({ ...formData, orderDescription: event.target.value })}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Price"
                        type="text"
                        fullWidth
                        rows={4}
                        value={formData.price}
                        onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Estimated Cost"
                        type="text"
                        fullWidth
                        rows={4}
                        value={formData.cost}
                        onChange={(event) => setFormData({ ...formData, cost: event.target.value })}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Customer</InputLabel>
                        <Select value={formData.selectedCustomer ? formData.selectedCustomer.customerId : ''} onChange={handleCustomerChange}>
                            {customer.map((customer) => (
                                <MenuItem key={customer.customerId} value={customer.customerId}>
                                    {customer.name}
                                </MenuItem>
                            ))}
                            <MenuItem value="new">Add New Customer</MenuItem>
                        </Select>
                    </FormControl>
                    {formData.selectedCustomer && (
                        <FormControl fullWidth>
                            <InputLabel>Vehicle</InputLabel>
                            <Select value={formData.selectedVehicle || ''} onChange={handleVehicleChange}>
                                {formData.selectedCustomer.vehicles.map((vehicle) => (
                                    <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                        {`${vehicle.make} ${vehicle.model} (${vehicle.year}) - ${vehicle.licensePlate}`}
                                    </MenuItem>
                                ))}
                                <MenuItem value="new">Add New Vehicle</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCloseAddDialog} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddCustomer} onClose={() => setOpenAddCustomer(false)}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        value={newCustomer.phoneNumber}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        type="text"
                        fullWidth
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddCustomer(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCustomerSubmit} color="primary">
                        Add Customer
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddVehicle} onClose={() => setOpenAddVehicle(false)}>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Make"
                        type="text"
                        fullWidth
                        value={newVehicle.make}
                        onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Model"
                        type="text"
                        fullWidth
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Year"
                        type="text"
                        fullWidth
                        value={newVehicle.year}
                        onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="License Plate"
                        type="text"
                        fullWidth
                        value={newVehicle.licensePlate}
                        onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddVehicle(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddVehicleSubmit} color="primary">
                        Add Vehicle
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Order;
