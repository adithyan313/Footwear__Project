import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbaradmin from "../NavebarAdmin";
import CheckAdminAuth from "./checkadmin";

const EditItem = () => {
    const { itemid } = useParams();
    const navigate = useNavigate();
    const user = useSelector((store) => store.auth.user);

    const [itemData, setItemData] = useState({
        brand: "",
        category: "",
        model: "",
        size: "",
        price: "",
        stock: "",
        is_disabled: false,
        image: null,
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setError("User not authenticated. Please log in.");
            navigate("/login");
            return;
        }

        axios.get(`http://127.0.0.1:8000/editlist/${itemid}/`, {
            headers: { Authorization: `Token ${user.token}` },
        })
        .then((response) => {
            setItemData(response.data);
            setLoading(false);
        })
        .catch((error) => {
            setError("Failed to retrieve footwear data.");
            setLoading(false);
        });
    }, [itemid, user, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItemData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setItemData((prevData) => ({
            ...prevData,
            image: file,
        }));
    };

    const updateItem = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("User not authenticated. Please log in.");
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("brand", itemData.brand);
        formData.append("category", itemData.category);
        formData.append("model", itemData.model);
        formData.append("size", itemData.size);
        formData.append("price", itemData.price);
        formData.append("stock", itemData.stock);
        formData.append("is_disabled", itemData.is_disabled);
        if (itemData.image) {
            formData.append("image", itemData.image);
        }

        try {
            await axios.put(
                `http://127.0.0.1:8000/edititem/${itemid}/`,
                formData,
                {
                    headers: {
                        Authorization: `Token ${user.token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("Product updated successfully");
            navigate('/listadmin');
        } catch (err) {
            setError("Failed to update product. Please check your input.");
            alert("You are not allowed to edit this item.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbaradmin/>
        <div>
            <Link to={`/listadmin`}>
                    <img src="/backback.png" alt="Todo List Icon" style={{ width: "40px", height: "35px", marginRight: "10px", marginTop: "20px", marginLeft: "20px" }} />
                               
                    </Link>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Edit Footwear</div>
                            <div className="card-body">
                                <form onSubmit={updateItem}>
                                    <div className="form-group" style={{width: "100%"}}>
                                        <select
                                            className="form-control"
                                            name="brand"
                                            value={itemData.brand}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Brand</option>
                                            <option value="1">Crocs</option>
                                            <option value="2">Adidas</option>
                                            <option value="3">Nike</option>
                                            <option value="4">Woodland</option>
                                            <option value="5">VKC</option>
                                            <option value="6">Puma</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        <select
                                            className="form-control"
                                            name="category"
                                            value={itemData.category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="1">Crocs</option>
                                            <option value="2">Sports Shoe</option>
                                            <option value="3">boots</option>
                                            <option value="4">slippers</option>
                                            <option value="5">sandals</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="model"
                                            value={itemData.model}
                                            onChange={handleInputChange}
                                            placeholder="Model Name..."
                                        />
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="size"
                                            value={itemData.size}
                                            onChange={handleInputChange}
                                            placeholder="Enter Size..."
                                        />
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="price"
                                            value={itemData.price}
                                            onChange={handleInputChange}
                                            placeholder="Enter Price..."
                                        />
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="stock"
                                            value={itemData.stock}
                                            onChange={handleInputChange}
                                            placeholder="Enter Stock..."
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="is_disabled"
                                            checked={itemData.is_disabled}
                                            onChange={handleInputChange}
                                            id="isDisabled"
                                        />
                                        <label>Is Disabled</label>
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        <input
                                            type="file"
                                            name="image"
                                            
                                            onChange={handleFileChange}
                                            className="form-control-file"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary" type="submit">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default CheckAdminAuth(EditItem);
