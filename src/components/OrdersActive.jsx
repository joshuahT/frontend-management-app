import React, { useState, useEffect } from 'react';
import OrderDropdown from './OrderDropdown';

function OrdersDisplay() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/orders/active')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Orders</h1>
            {orders.map(order => (
                <OrderDropdown key={order.orderId} order={order} />
            ))}
        </div>
    );
}

export default OrdersDisplay;