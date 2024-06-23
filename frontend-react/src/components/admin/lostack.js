import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbaradmin from '../NavebarAdmin';
import CheckAdminAuth from './checkadmin';

const LowStockManager = () => {
  const user = useSelector((store) => store.auth.user);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [footwearId, setFootwearId] = useState('');
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = () => {
    axios.get('http://localhost:8000/low_stock/', {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    })
      .then(response => {
        setLowStockProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the low stock products!', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/low_stock/', { footwear_id: footwearId, new_stock: newStock }, {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    })
      .then(response => {
        alert('Stock updated successfully');
        setFootwearId('');
        setNewStock('');
        fetchLowStockProducts(); // Refresh the list after updating
      })
      .catch(error => {
        console.error('There was an error updating the stock!', error);
      });
  };

  return (
    <div>
      <Navbaradmin/>
    <div className="container mt-5">
      <h1>Low Stock Products</h1>
      <div className="row">
        <div className="col-md-8">
          <ul className="list-group">
            {lowStockProducts.map(product => (
              <li 
                key={product.id} 
                className="list-group-item d-flex justify-content-between align-items-center mb-2 p-3"
                style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={`http://127.0.0.1:8000${product.image}`}
                    alt="Product"
                    style={{ width: '90px', height: '60px', borderRadius: '5px', marginRight: '15px' }}
                  />
                  <div>
                    <h5 className="mb-1">{product.model}</h5>
                    <small>ID: {product.id}</small>
                  </div>
                </div>
                <span className="badge badge-primary badge-pill">Stock: {product.stock}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-4">
          <div className="sticky-top">
            <h2>Update Stock</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Footwear ID:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={footwearId} 
                  onChange={e => setFootwearId(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>New Stock:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newStock} 
                  onChange={e => setNewStock(e.target.value)} 
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Stock</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CheckAdminAuth(LowStockManager);
