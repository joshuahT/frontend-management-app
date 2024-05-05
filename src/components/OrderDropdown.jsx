import React, { useState } from 'react';

function OrderDropdown({ order }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div>
            <button class="button-85" onClick={toggleDropdown}>
                {order.orderName} {isOpen ? '^' : 'v'}
            </button>
            {isOpen && (
                <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                    <p>Description: {order.orderDescription || 'No description'}</p>
                    <p>Status: {order.status ? 'Completed' : 'Pending'}</p>
                    <p>Price: {order.price ? `$${order.price}` : 'Not available'}</p>
                    <p>Cost: {order.cost ? `$${order.cost}` : 'Not available'}</p>
                </div>
            )}
        </div>
    );
}

export default OrderDropdown;