import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../navebar";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const user = useSelector((store) => store.auth.user);
    const [results, setResults] = useState([]);
    let query = useQuery().get("q");

    useEffect(() => {
        if (query) {
            axios.get(`http://127.0.0.1:8000/search/?q=${query}`, {
                headers: {
                    Authorization: `Token ${user.token}`
                }
            })
            .then((response) => {
                setResults(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch search results:", error);
            });
        }
    }, [query, user.token]);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h2>Search Results for "{query}"</h2>
                <div className="row">
                    {results.map((item) => (
                        <div key={item.id} className="col-md-4">
                            <div className="card mb-3">
                            <Link to={`/viewdetail/${item.id}`}>
                                <img className="card-img-top"
                                    src={`http://127.0.0.1:8000${item.image}`}
                                    alt={item.model}
                                    style={{ width: "100%", height: "100%" }}
                                />
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title">{item.model}</h5>
                                    <p className="card-text">{item.brand.name}</p>
                                    <p className="card-text">{item.category.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchResults;
