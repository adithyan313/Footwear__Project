import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FilterSidebar({ toggleFilter }) {
    const [filters, setFilters] = useState({
        brand: "",
        category: "",
        min_price: "",
        max_price: "",
        size: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        const query = new URLSearchParams(filters).toString();
        navigate(`/searchfilter?${query}`);
        toggleFilter();
    };

    return (
        <div className="filter-sidebar" style={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: '300px',
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
            padding: '20px',
            zIndex: 1000,
            transition: 'transform 0.3s ease-in-out'
        }}>
            <h2>Filter Products</h2>
            <div className="form-group">
                <label>Brand</label>
                <select
                    className="form-control mb-3"
                    name="brand"
                    value={filters.brand}
                    onChange={handleChange}
                >
                    <option value="">Select Brand</option>
                    <option value="V-K-C">VKC</option>
                    <option value="Adidas">Adidas</option>
                    <option value="Nike">Nike</option>
                    <option value="Crocs">Crocs</option>
                </select>
            </div>
            <div className="form-group">
                <label>Category</label>
                <select
                    className="form-control mb-3"
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    <option value="sports shoe">sports shoe</option>
                    <option value="canvas shoe">canvas shoe</option>
                    <option value="sandals">sandals</option>
                    <option value="slippers">slippers</option>
                    <option value="crocs street">crocs street</option>
                    <option value="boots">boots</option>
                </select>
            </div>
            <div className="form-group">
                <label>Min Price</label>
                <input
                    type="number"
                    name="min_price"
                    value={filters.min_price}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Max Price</label>
                <input
                    type="number"
                    name="max_price"
                    value={filters.max_price}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Size</label>
                <select
                    className="form-control mb-3"
                    name="size"
                    value={filters.size}
                    onChange={handleChange}
                >
                    <option value="">Select Size</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="8.5">8.5</option>
                    <option value="9">9</option>
                    <option value="9.5">9.5</option>
                    <option value="10">10</option>
                    <option value="10.5">10.5</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                </select>
            </div>
            <button onClick={applyFilters} className="btn btn-primary">Apply Filters</button>
            <button onClick={toggleFilter} className="btn btn-secondary">Close</button>
        </div>
    );
}

export default FilterSidebar;
