import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../navebar";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchFilter() {
    const user = useSelector((store) => store.auth.user);
    const [products, setProducts] = useState([]);
    const query = useQuery();

    useEffect(() => {
        const fetchFilteredProducts = () => {
            const params = {
                brand: query.get('brand'),
                category: query.get('category'),
                min_price: query.get('min_price'),
                max_price: query.get('max_price'),
                size: query.get('size'),
            };
            axios.get("http://127.0.0.1:8000/filter_products/", {
                params,
                headers: {
                    Authorization: `Token ${user.token}`
                    },
            })
                .then((response) => {
                    setProducts(response.data);
                })
                .catch((error) => {
                    console.error("Failed to fetch filtered products:", error);
                });
        };
        fetchFilteredProducts();
    }, [query, user.token]);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="row">
                    {products.map((item) => (
                        <div key={item.id} className="col-md-4" style={{ paddingLeft: "3px" }}>
                            <div className="card-lg mb-3">
                            <Link to={`/viewdetail/${item.id}`}>
                                <img className="card-img-top"
                                    src={`http://127.0.0.1:8000${item.image}`}
                                    alt="product"
                                    style={{ width: "100%", height: "100%", borderRadius: "5px" }}
                                />
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title">{item.model}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchFilter;
