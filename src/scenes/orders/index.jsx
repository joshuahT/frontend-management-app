import { Box, Typography, useTheme, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Switch } from "@mui/material";
import React, { useState, useEffect } from 'react';

const Order = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [Orders, SetOrders] = useState([]); // this for all orders
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [active, setActive] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
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
    const [refreshCustomers, setRefreshCustomers] = useState(false);

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
    }, [refreshCustomers]);

    const columns = [
        { field: "orderId", headerName: "ID" },
        { field: "orderName", headerName: "Order Name" },
        { field: "orderDescription", headerName: "Order Description" },
        { field: "price", headerName: "Price" },
        { field: "cost", headerName: "Cost" },
        { field: "customerName", headerName: "Customer Name" },
        { field: "phoneNumber", headerName: "Phone number" },
        { field: "email", headerName: "Email" },
        { field: "vehicleDetails", headerName: " Vehicle Details" },
        {
            field: "status", headerName: "Active/Past", width: 130, renderCell: (params) => (
                <Switch
                    checked={!params.row.status} // Assuming false = active, true = past
                    onChange={() => handleStatusToggle(params.row.orderId, !params.row.status)}
                    sx={{
                        "& .MuiSwitch-thumb": {
                            backgroundColor: params.row.status ? "#4cceac" : "#db4f4a", // Green for Active, Red for Past
                        },
                        "& .MuiSwitch-track": {
                            backgroundColor: params.row.status ? "#2e7c67" : "#af3f3b", // Darker shade for contrast
                            opacity: 1, // Ensure visibility
                        },
                        "& .Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#af3f3b", // Green Accent when Active
                            opacity: 1, // Prevent MUI opacity override
                        },
                    }}
                />
            )
        },
        {
            field: "edit", headerName: "   Edit", width: 100, renderCell: (params) => (
                <Button color="primary"
                    variant="contained"
                    onClick={() => handleEditOrder(params.row)} // make function handleEditOrder, we checked that the params.row gives us the selected order when clicked
                    sx={{
                        backgroundColor: "#4cceac", // Apply the custom background color
                        "&:hover": {
                            backgroundColor: "#3da58a",
                        }
                    }}
                >
                    Edit
                </Button>

            )
        }
    ];

    const rows = Orders.map(order => ({
        orderId: order.orderId,
        orderName: order.orderName,
        orderDescription: order.orderDescription,
        status: order.status ? false : true,
        price: order.price || "N/A",
        cost: order.cost || "N/A",
        customerName: order.customer ? order.customer.name : "N/A",
        phoneNumber: order.customer ? order.customer.phoneNumber : "N/A",
        email: order.customer ? order.customer.email : "N/A",
        vehicleDetails: order.customer && order.customer.vehicles.length > 0 ?
            `${order.customer.vehicles[0].make} ${order.customer.vehicles[0].model} (${order.customer.vehicles[0].year}) - ${order.customer.vehicles[0].licensePlate}` :
            "N/A"
    }));

    const handleEditOrder = (row) => {
        const fullOrder = Orders.find(order => order.orderId === row.orderId); // Find full object
        console.log("Full Order Data:", fullOrder); // Debugging
        setSelectedOrder(fullOrder || {}); // Ensure we pass the full object
        setOpenEditDialog(true);
    };

    const handleCloseEditOrder = () => {
        setOpenEditDialog(false);
    }

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
            const selectedVehicle = formData.selectedCustomer.vehicles.find(vehicle => vehicle.vehicleId === parseInt(vehicleId));
            setFormData({
                ...formData,
                selectedVehicle: selectedVehicle
            });
        }
    };
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
                setRefreshCustomers((prev) => !prev);
            })
            .catch(error => {
                console.error('Error adding customer', error);
            });
    };

    const handleAddVehicleSubmit = () => {

        const customerId = formData.selectedCustomer.customerId;
        const vehicleData = { ...newVehicle, customerId };

        console.log(vehicleData);

        fetch("http://localhost:8080/vehicles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vehicleData),
        })
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
        const orderData = {
            orderName: formData.orderName,
            orderDescription: formData.orderDescription,
            price: formData.price,
            cost: formData.cost,
            status: false,
            customer: {
                customerId: formData.selectedCustomer.customerId,
                phoneNumber: formData.selectedCustomer.phoneNumber,
                name: formData.selectedCustomer.name,
                email: formData.selectedCustomer.email,
                address: formData.selectedCustomer.address,
                vehicles: formData.selectedCustomer.vehicles,
            },
            vehicle: formData.selectedVehicle
        };

        console.log(orderData);


        fetch("http://localhost:8080/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        })
            .then(response => response.json())
            .then((newOrder) => {

                SetOrders(prevOrders => [...prevOrders, newOrder]);

                setFormData({
                    orderName: '',
                    orderDescription: '',
                    price: '',
                    cost: '',
                    selectedCustomer: null,
                    selectedVehicle: null,
                });
                setOpenAddDialog(false);
            })
            .catch((error) => {
                console.error("Error adding order", error);
            });
    };

    const handleStatusToggle = (orderId, status) => {

        const newStatus = !status;  // If true (past), make it false (active), and vice versa

        fetch(`http://localhost:8080/orders/${orderId}/update-status?newStatus=${newStatus}`, {
            method: "PUT",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error updating order status');
                }
                // Try to parse the response as JSON, but if it fails, handle it as plain text
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (err) {
                        return text;  // In case of non-JSON response (like a success message)
                    }
                });
            })
            .then((data) => {
                console.log('Response from server:', data);
                // Update the order status in the frontend (even for a success message)
                SetOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderId === orderId ? { ...order, status: newStatus } : order
                    )
                );
            })
            .catch((error) => {
                console.error("Failed to update order status:", error);
            });
    };

    const handleUpdateOrder = () => {
        console.log(JSON.stringify(selectedOrder));
        fetch(`http://localhost:8080/orders/${selectedOrder.orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedOrder),
        })
            .then((response) => {
                // console.log(response);
                if (!response.ok) {
                    throw new Error("Couldn't Update Order")
                }
                return response;
            })
            .then((updatedOrder) => {
                // console.log(updatedOrder);
                // Update the local state
                SetOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderId === updatedOrder.orderId ? updatedOrder : order
                    )
                );
                setOpenEditDialog(false);
            })
            .catch((error) => {
                console.error("Error updating order:", error);
            });
    };

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
                        backgroundColor: colors.primary[400],
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
            <Button variant="contained" color="primary" onClick={handleAddOrder} sx={{
                backgroundColor: "#4cceac", // Apply the custom background color
                "&:hover": {
                    backgroundColor: "#3da58a",
                }
            }}>
                Add New Order
            </Button>

            <Dialog open={openEditDialog} onClose={handleCloseEditOrder}>
                <DialogTitle>Edit Order</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Order Name"
                        type="text"
                        fullWidth
                        value={selectedOrder?.orderName || ''} // option chaining, checks if selectedOrder exist if not then instead of throwing Error it will be undefined 
                        onChange={(event) => setSelectedOrder({ ...selectedOrder, orderName: event.target.value })} // everything in selected order is the same, but changes are made to order name 
                    />
                    <TextField
                        margin="dense"
                        label="Order Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={selectedOrder?.orderDescription || ""}
                        onChange={(e) =>
                            setSelectedOrder({ ...selectedOrder, orderDescription: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="text"
                        fullWidth
                        value={selectedOrder?.price || ""}
                        onChange={(e) =>
                            setSelectedOrder({ ...selectedOrder, price: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Cost"
                        type="text"
                        fullWidth
                        value={selectedOrder?.cost || ""}
                        onChange={(e) =>
                            setSelectedOrder({ ...selectedOrder, cost: e.target.value })
                        }
                    />
                    {/* Display Customer (Read-Only) */}
                    <TextField
                        margin="dense"
                        label="Customer"
                        type="text"
                        fullWidth
                        value={selectedOrder?.customer?.name || 'N/A'}
                        InputProps={{ readOnly: true }}
                    />

                    {/* Display Vehicle (Read-Only) */}
                    <TextField
                        margin="dense"
                        label="Vehicle"
                        type="text"
                        fullWidth
                        value={
                            selectedOrder?.vehicle
                                ? `${selectedOrder.vehicle.make} ${selectedOrder.vehicle.model} (${selectedOrder.vehicle.year}) - ${selectedOrder.vehicle.licensePlate}`
                                : 'N/A'
                        }
                        InputProps={{ readOnly: true }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditOrder} color="primary" variant="contained" sx={{
                        backgroundColor: "#db4f4a", // Apply the custom background color
                        "&:hover": {
                            backgroundColor: "#af3f3b",
                        }
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateOrder} color="primary" variant="contained" sx={{
                        backgroundColor: "#4cceac", // Apply the custom background color
                        "&:hover": {
                            backgroundColor: "#3da58a",
                        }
                    }}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <DialogTitle> Add Order</DialogTitle>
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
                            <Select value={formData.selectedVehicle ? formData.selectedVehicle.vehicleId : ''} onChange={handleVehicleChange}>
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
                    <Button onClick={handleCloseAddDialog} color="primary" variant="contained" sx={{
                        backgroundColor: "#db4f4a", // Apply the custom background color
                        "&:hover": {
                            backgroundColor: "#af3f3b",
                        }
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrderSubmit} color="primary" variant="contained" sx={{
                        backgroundColor: "#4cceac", // Apply the custom background color
                        "&:hover": {
                            backgroundColor: "#3da58a",
                        }
                    }}>
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
