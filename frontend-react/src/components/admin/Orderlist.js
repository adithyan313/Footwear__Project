// OrderList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const OrderList = () => {
  const user = useSelector(state => state.auth.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user && user.token) {
      fetchOrders();
    }
  }, [user]); // Fetch orders whenever user changes

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/myorder/', {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="container">
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Payment ID</th>
            <th>Delivery Address</th>
            <th>Pincode</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>{order.razorpay_payment_id}</td>
              <td>{order.delivery_address}</td>
              <td>{order.pincode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
