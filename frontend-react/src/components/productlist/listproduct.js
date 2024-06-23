/*import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../navebar";
import { Link } from "react-router-dom";

function ListProduct() {
    const [posts, setPosts] = useState([]);

    const fetchPosts = useCallback(() => {
        axios.get("http://127.0.0.1:8000/listitem/")
        .then((response) => {
            setPosts(response.data);
        })
        .catch((error) => {
            console.error("Failed to fetch posts:", error);
        });
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div>
            <Navbar />
            <div className="carousel slide" id="hello" data-ride="carousel">
                <ul className="carousel-indicators">
                    {posts.map((item, index) => (
                        <li
                            key={index}
                            data-target="#hello"
                            data-slide-to={index}
                            className={index === 0 ? "active" : ""}
                        ></li>
                    ))}
                </ul>
                <div className="carousel-inner">
                    {posts.map((item, index) => (
                        <div
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                            key={item.id}
                        >
                            <Link to={`/viewdetail/${item.id}`}>
                                <img
                                    src={`http://127.0.0.1:8000${item.image}`}
                                    alt="allapuzha"
                                    width="100%"
                                    height="370px"
                                />
                                <div className="carousel-caption">
                                    <h1 className="text-white">{item.name}</h1>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <a className="carousel-control-prev" href="#hello" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#hello" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
            <div className="container mt-4 pl-5">
                <div className="row">
                    {posts.map((item) => (
                        <div key={item.id} className="col-lg-3" style={{ paddingLeft: "3px" }}>
                            <div className="card-lg mb-3" style={{width: "350px", border: "1px solid black", borderRadius: "7px"}}>
                                <Link to={`/viewdetail/${item.id}`}>
                                    <img
                                        className="card-img-top"
                                        src={`http://127.0.0.1:8000${item.image}`}
                                        alt="ok"
                                        style={{ width: "100%", height: "100%", borderRadius: "5px" }}
                                    />
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title">{item.model}</h5>
                                    <p>{item.price}&#8377; &nbsp; &nbsp; &nbsp; <span>⭐4.5</span></p>
                                    {item.model === "2024" && (
                                        <p style={{ color: "red", fontWeight: "bold" }}>
                                            Special Edition: 2024 Model
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListProduct;*/
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../navebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckAuth from "../auth/CkeckAuth";

function ListProduct() {
    const user = useSelector((store) => store.auth.user);
    const [posts, setPosts] = useState([]);

    const fetchPosts = useCallback(() => {
        if (user) {
        axios.get("http://127.0.0.1:8000/listitem/", {
            headers: {
                Authorization: `Token ${user.token}`
            }
        })
        .then((response) => {
            setPosts(response.data);
        })
        .catch((error) => {
            console.error("Failed to fetch posts:", error);
        });
    }
    }, [user]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div>
            <Navbar />
            <div id="demo" class="carousel slide" data-ride="carousel">
  <ul class="carousel-indicators">
    <li data-target="#demo" data-slide-to="0" class="active"></li>
    <li data-target="#demo" data-slide-to="1"></li>
    <li data-target="#demo" data-slide-to="2"></li>
  </ul>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="/offer.png" alt="Alappuzha" width="100%" height="400"/>
    </div>
    <div class="carousel-item">
      <img src="/commingsoon.png" alt="Kovalam" width="100%" height="400"/>
    </div>
    <div class="carousel-item">
      <img src="/crocs slide.png" alt="Trivandrum" width="100%" height="400"/>
    </div>
  </div>
  <a class="carousel-control-prev" href="#demo" data-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </a>
  <a class="carousel-control-next" href="#demo" data-slide="next">
    <span class="carousel-control-next-icon"></span>
  </a>
</div>
            <div className="container mt-4 pl-5">
                <div className="row">
                    {posts.map((item) => (
                        <div key={item.id} className="col-lg-3 mb-3" style={{ 
                            paddingLeft: "3px",
                            // Media queries inline styles
                            width: "100%", // Default width for all screens
                            '@media (min-width: 992px)': {
                                maxWidth: "25%" // Four items per row on large screens (desktop)
                            },
                            '@media (max-width: 991px)': {
                                maxWidth: "50%" // Two items per row on medium screens (tablet)
                            },
                            '@media (max-width: 768px)': {
                                maxWidth: "100%" // One item per row on small screens (mobile)
                            }
                        }}>
                            <div className="card-lg mb-3">
                                <Link to={`/viewdetail/${item.id}`}>
                                    <img
                                        className="card-img-top"
                                        src={`http://127.0.0.1:8000${item.image}`}
                                        alt="Product"
                                        style={{
                                            width: "100%", // Ensures image fills the container
                                            height: "auto", // Maintain aspect ratio
                                            borderRadius: "5px" // Rounded corners
                                        }}
                                    />
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title">{item.model}</h5>
                                    <p>{item.price}&#8377; &nbsp; &nbsp; &nbsp; <span>⭐4.5</span></p>
                                    {item.model === "2024" && (
                                        <p style={{ color: "red", fontWeight: "bold" }}>
                                            Special Edition: 2024 Model
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CheckAuth(ListProduct);
