/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbar from '../navebar';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const user = useSelector((store) => store.auth.user);
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get('http://127.0.0.1:8000/cart/view/', {
                headers: { Authorization: `Token ${user.token}` },
            })
            .then((response) => {
                setCart(response.data);
                setError(null);
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch cart details. Please try again later.");
                setLoading(false);
            });
        }
    }, [user]);

    const removeCartItem = (cartItemId) => {
        axios.delete(`http://127.0.0.1:8000/cart/remove/${cartItemId}`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then(response => {
          setCart(prevCart => ({
              ...prevCart,
              items: prevCart.items.filter(item => item.id !== cartItemId)
          }));
          alert('Item removed from cart');
        })
        .catch(error => {
          console.error('There was an error removing the item from the cart!', error);
        });
    };

    const handlePayment = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/place_order/`, {
                delivery_address: deliveryAddress,
                pincode: pincode
            }, {
                headers: { Authorization: `Token ${user.token}` },
            });

            const { razorpay_order_id, amount, currency, order_id } = response.data;

            const options = {
                key: 'rzp_test_oYKWoicTr0HXCT',
                amount: amount,
                currency: currency,
                name: 'Your Company Name',
                description: 'Order Payment',
                order_id: razorpay_order_id,
                handler: async (response) => {
                    const paymentData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    const verifyResponse = await axios.post(`http://127.0.0.1:8000/confirm_payment/`, paymentData, {
                        headers: { Authorization: `Token ${user.token}`},
                    });

                    if (verifyResponse.status === 200) {
                        alert('Payment successful');
                        navigate('/')
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'aadhiadithyan313@gmail.com',
                    email: 'your-email@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#F37254'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error in payment:', error);
            alert('Payment failed');
        }
    };

    const openAddressModal = () => {
        setShowAddressModal(true);
    };

    const closeAddressModal = () => {
        setShowAddressModal(false);
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        closeAddressModal();
        handlePayment();
    };

    const loadingStyle = {
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };

    const errorStyle = {
        color: "red",
        textAlign: "center",
        marginTop: "20px"
    };

    const modalStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        zIndex: 1000
    };

    const cartItemStyle = {
        border: '1px solid #e8e8e8',
        borderRadius: '4px',
        marginBottom: '20px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '100%' // Ensure each cart item takes full width
    };

    const imageStyle = {
        width: '100%',
        height: 'auto',
        marginRight: '20px',
        borderRadius: '4px'
    };

    const detailsStyle = {
        flex: '1',
        textAlign: 'left'
    };

    const priceStyle = {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#388e3c'
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5" style={{ padding: '20px', borderRadius: '4px' }}>
                <h2 className='cart-icon'>
                    Your Cart <img src="/grocery.gif" alt="Todo List Icon" style={{ width: "50px", marginRight: "10px" }} />
                </h2>
                <hr />
                <div className='row'>
                    {loading ? (
                        <center style={loadingStyle}>
                            <div className="spinner-border text-primary"></div>
                        </center>
                    ) : error ? (
                        <div style={errorStyle}>{error}</div>
                    ) : cart && cart.items.length > 0 ? (
                        cart.items.map((item) => (
                            <div className='row' key={item.id} style={cartItemStyle}>
                                <div className='col-md-3'>
                                    <img 
                                        src={`http://127.0.0.1:8000${item.footwear.image}`} 
                                        alt={item.footwear.model}
                                        style={imageStyle}
                                    />
                                </div>
                                <div className='col-md-3' style={{ textAlign: 'left' }}>
                                    <h3>{item.footwear.model}</h3>
                                    <p>{item.footwear.brand.name}</p>
                                    <p>{item.footwear.category.name}</p>
                                </div>
                                <div className='col-md-3'>
                                    <p><b>Quantity:</b> {item.quantity}</p>
                                    <p>{item.footwear.size}</p>
                                    <p style={priceStyle}>&#8377;{item.footwear.price}</p>
                                </div>
                                <div className='col-md-3' style={{ textAlign: 'right' }}>                                    
                                    <button className='btn btn-outline-danger' onClick={() => removeCartItem(item.id)}>Remove</button><br/><br/><br/><br/>
                                    <button className='btn btn-outline-success' onClick={openAddressModal}>Book Product</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Your cart is empty.</div>
                    )}
                </div>
            </div>

            {showAddressModal && (
                <div style={modalStyle}>
                    <center><h2>Delivery Address</h2></center>
                    <form onSubmit={handleAddressSubmit}>
                        <div>
                            <label>Delivery Address:</label>
                            <input
                                type="text"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label>Pincode:</label>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <button type="submit" className='btn btn-success' style={{width: "250px", marginBottom: "5px"}}>
                            Submit
                        </button>
                        <button type="button" onClick={closeAddressModal} className='btn btn-danger' style={{width: "250px"}}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Cart;*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbar from '../navebar';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const user = useSelector((store) => store.auth.user);
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get('http://127.0.0.1:8000/cart/view/', {
                headers: { Authorization: `Token ${user.token}` },
            })
            .then((response) => {
                setCart(response.data);
                setError(null);
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch cart details. Please try again later.");
                setLoading(false);
            });
        }
    }, [user]);

    const removeCartItem = (cartItemId) => {
        axios.delete(`http://127.0.0.1:8000/cart/remove/${cartItemId}/`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then(response => {
          setCart(prevCart => ({
              ...prevCart,
              items: prevCart.items.filter(item => item.id !== cartItemId)
          }));
          alert('Item removed from cart');
        })
        .catch(error => {
          console.error('There was an error removing the item from the cart!', error);
        });
    };

    const increaseQuantity = (itemId) => {
        const updatedCart = { ...cart };
        const itemToUpdate = updatedCart.items.find(item => item.id === itemId);
        if (itemToUpdate) {
            itemToUpdate.quantity += 1;
            setCart(updatedCart);
        }
    };

    const decreaseQuantity = (itemId) => {
        const updatedCart = { ...cart };
        const itemToUpdate = updatedCart.items.find(item => item.id === itemId);
        if (itemToUpdate && itemToUpdate.quantity > 1) {
            itemToUpdate.quantity -= 1;
            setCart(updatedCart);
        }
    };

    const handlePayment = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/place_order/`, {
                delivery_address: deliveryAddress,
                pincode: pincode
            }, {
                headers: { Authorization: `Token ${user.token}` },
            });

            const { razorpay_order_id, amount, currency, order_id } = response.data;

            const options = {
                key: 'rzp_test_oYKWoicTr0HXCT',
                amount: amount,
                currency: currency,
                name: 'Your Company Name',
                description: 'Order Payment',
                order_id: razorpay_order_id,
                handler: async (response) => {
                    const paymentData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    const verifyResponse = await axios.post(`http://127.0.0.1:8000/confirm_payment/`, paymentData, {
                        headers: { Authorization: `Token ${user.token}`},
                    });

                    if (verifyResponse.status === 200) {
                        alert('Payment successful');
                        navigate('/')
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'aadhiadithyan313@gmail.com',
                    email: 'your-email@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#F37254'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error in payment:', error);
            alert('Payment failed');
        }
    };


    const openAddressModal = () => {
        setShowAddressModal(true);
    };

    const closeAddressModal = () => {
        setShowAddressModal(false);
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        closeAddressModal();
        handlePayment();
    };

    const loadingStyle = {
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };

    const errorStyle = {
        color: "red",
        textAlign: "center",
        marginTop: "20px"
    };

    const modalStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        zIndex: 1000
    };

    const cartItemStyle = {
        border: '1px solid #e8e8e8',
        borderRadius: '4px',
        marginBottom: '20px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '100%' // Ensure each cart item takes full width
    };

    const imageStyle = {
        width: '100%',
        height: 'auto',
        marginRight: '20px',
        borderRadius: '4px'
    };

    const detailsStyle = {
        flex: '1',
        textAlign: 'left'
    };

    const priceStyle = {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#388e3c'
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5" style={{ padding: '20px', borderRadius: '4px' }}>
                <h2 className='cart-icon'>
                    Your Cart <img src="/grocery.gif" alt="Todo List Icon" style={{ width: "50px", marginRight: "10px" }} />
                </h2>
                <hr />
                <div className='row'>
                    {loading ? (
                        <center style={loadingStyle}>
                            <div className="spinner-border text-primary"></div>
                        </center>
                    ) : error ? (
                        <div style={errorStyle}>{error}</div>
                    ) : cart && cart.items.length > 0 ? (
                        cart.items.map((item) => (
                            <div className='row' key={item.id} style={cartItemStyle}>
                                <div className='col-md-3'>
                                    <img 
                                        src={`http://127.0.0.1:8000${item.footwear.image}`} 
                                        alt={item.footwear.model}
                                        style={imageStyle}
                                    />
                                </div>
                                <div className='col-md-3' style={{ textAlign: 'left' }}>
                                    <h3>{item.footwear.model}</h3>
                                    <p>{item.footwear.brand.name}</p>
                                    <p>{item.footwear.category.name}</p>
                                </div>
                                <div className='col-md-3'>
                                    <p>
                                        <br />
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => decreaseQuantity(item.id)}>-</button>
                                        &nbsp;
                                        {item.quantity}
                                        &nbsp;
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => increaseQuantity(item.id)}>+</button>
                                    </p>
                                    <p>{item.footwear.size}</p>
                                    <p style={priceStyle}>&#8377;{item.footwear.price}</p>
                                </div>
                                <div className='col-md-3' style={{ textAlign: 'right' }}>                                    
                                    <button className='btn btn-outline-danger' onClick={() => removeCartItem(item.id)}>Remove</button><br/><br/><br/><br/>
                                    <button className='btn btn-outline-success' onClick={openAddressModal}>Book Product</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Your cart is empty.</div>
                    )}
                </div>
            </div>

            {showAddressModal && (
                <div style={modalStyle}>
                    <center><h2>Delivery Address</h2></center>
                    <form onSubmit={handleAddressSubmit}>
                        <div>
                            <label>Delivery Address:</label>
                            <input
                                type="text"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label>Pincode:</label>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <button type="submit" className='btn btn-success' style={{width: "250px", marginBottom: "5px"}}>
                            Submit
                        </button>
                        <button type="button" onClick={closeAddressModal} className='btn btn-danger' style={{width: "250px"}}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Cart;

