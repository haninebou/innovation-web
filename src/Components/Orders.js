import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Navbar from './NavBar';
import Footer from './Footer';
import '../CSS/Orders.css';  // Optional for additional styling

const Orders = () => {
  const [orders, setOrders] = useState([]);  // Initialize orders as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8081/orders');  // Adjust URL to your backend
        const data = await response.json();
        setOrders(data);  // Set the fetched orders
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5 orders-component">
        <h2 className="mb-4">All Orders</h2>
        {orders.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>State</th>
                <th>Delivery Mode</th>
                <th>Subtotal</th>
                <th>Total</th>
                <th>Items</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.full_name}</td>
                  <td>{order.email}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.state}</td>
                  <td>{order.delivery_mode}</td>
                  <td>{order.subtotal} DA</td>
                  <td>{order.total} DA</td>
                  <td>
                    {order.items && order.items.length > 0 ? (
                      <button
                        onClick={() => {
                          const items = order.items
                            .map(item => `- ${item.name} (x${item.quantity})`)
                            .join('\n');
                          alert(`Order Items:\n\n${items}`);
                        }}
                      >
                        View Items
                      </button>
                    ) : (
                      <span>No items</span>
                    )}
                  </td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
