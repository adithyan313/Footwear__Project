import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../navebar';
import CheckAuth from '../auth/CkeckAuth';

const OrderHistory = () => {
    const user = useSelector((store) => store.auth.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            
            try {
                const response = await axios.get('http://127.0.0.1:8000/myorder/', {
                    headers: {
                        Authorization: `Token ${user.token}`,
                    },
                });
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [navigate, user]);

    const downloadReceipt = async (productID) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/download/${productID}/`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            });

            // Create a blob URL for the PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Create a link element and trigger a click to download the PDF
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `order_${productID}_receipt.pdf`);
            document.body.appendChild(link);
            link.click();

            // Cleanup: Revoke the blob URL
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading receipt:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading order history: {error.message}</div>;

    return (
        <div>
            <Navbar/>
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Order History<img src="/delivery-scooter.gif" alt="Order Icon" style={{ width: "60px", marginRight: "10px" }} /></h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {orders.map((order) => (
                    <li 
                        key={order.id} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            backgroundColor: '#fff'
                        }}
                    >
                        {order.footwear ? (
                            <>
                                <img 
                                    src={`http://127.0.0.1:8000${order.footwear.image}`} 
                                    alt={order.footwear.model} 
                                    style={{ 
                                        width: '100px', 
                                        height: '100px', 
                                        objectFit: 'cover', 
                                        borderRadius: '10px',
                                        marginRight: '20px'
                                    }} 
                                />
                                <div style={{ flexGrow: 1 }}>
                                    <h2 style={{ margin: '0 0 10px 0' }}>{order.footwear.model}</h2>
                                    <p style={{ margin: '0 0 5px 0' }}><strong>Quantity:</strong> {order.quantity}</p>
                                    <p style={{ margin: '0 0 5px 0' }}><strong>Price:</strong> ${order.footwear.price}</p>
                                    <p style={{ margin: '0 0 5px 0' }}><strong>Total:</strong> ${order.footwear.price * order.quantity}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ color: 'green', margin: '0 0 10px 0' }}>Delivered on {new Date(order.delivery_date).toLocaleDateString()}</p>
                                    <button 
                                        onClick={() => downloadReceipt(order.id)}
                                        style={{
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            backgroundColor: '#2874f0',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '5px',
                                            textDecoration: 'none',
                                            display: 'inline-block',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Download Receipt
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p>Footwear details not available for Order {order.id}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default CheckAuth(OrderHistory);
