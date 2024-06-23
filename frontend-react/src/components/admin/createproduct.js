import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbaradmin from "../NavebarAdmin";
import CheckAdminAuth from "./checkadmin";

function CreateFootwear() {
    const user = useSelector((store) => store.auth.user);

    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [model, setModel] = useState("");
    const [size, setSize] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [isDisabled, setDisabled] = useState(false);
    const [image, setImage] = useState(null);

    const handleBrandChange = (event) => {
        setBrand(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const addPost = (event) => {
        event.preventDefault(); 
        const formData = new FormData();
        formData.append("brand", brand);  
        formData.append("category", category); 
        formData.append("model", model);
        formData.append("size", size);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("is_disabled", isDisabled);
        if (image) {
            formData.append("image", image);
        }

        axios.post(
            "http://localhost:8000/addfoot/",  
            formData,
            {
                headers: {
                    Authorization: `Token ${user.token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((response) => {
            alert("Item added successfully");
        })
        .catch((error) => {
            console.error("Error adding item:", error);
        });
    };

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
                            <div className="card-header">Add Footwear</div>
                            <div className="card-body">
                                <form onSubmit={addPost}>
                                    <div className="form-group" style={{width: "100%"}}>
                                      
                                        <select className="form-control" value={brand} onChange={handleBrandChange}>
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
                                        
                                        <select className="form-control" value={category} onChange={handleCategoryChange}>
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
                                            value={model}
                                            onChange={(event) => setModel(event.target.value)}
                                            placeholder="Model Name...."
                                        />
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                       
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={size}
                                            onChange={(event) => setSize(event.target.value)}
                                            placeholder="Enter Size...."
                                        />
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={price}
                                            onChange={(event) => setPrice(event.target.value)}
                                            placeholder="Enter Price...."
                                        />
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={stock}
                                            onChange={(event) => setStock(event.target.value)}
                                            placeholder="Enter Stock...."
                                        />
                                    </div>
                                    <div >
                                        <input
                                            type="checkbox"
                                            checked={isDisabled}
                                            onChange={(event) => setDisabled(event.target.checked)}
                                            id="isDisabled"
                                        />
                                        <label>is dispatch</label>
                                    </div>
                                    <div className="form-group" style={{width: "100%"}}>
                                        
                                        <input 
                                            type="file" 
                                            name="image"
                                            onChange={(event) => setImage(event.target.files[0])}
                                            className="form-control-file"
                                        />
                                    </div>
                                    <div className="form-group" >
                                        <button  className="btn btn-primary" type="submit">
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
}

export default CheckAdminAuth(CreateFootwear);
