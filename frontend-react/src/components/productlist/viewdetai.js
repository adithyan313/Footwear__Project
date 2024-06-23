import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navebar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function ViewDetail() {
    const user = useSelector((store) => store.auth.user);
    const { itemid } = useParams();
    const [post, setPost] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const view = useCallback(() => {
        if (user) {
            axios.get(`http://127.0.0.1:8000/product_details/${itemid}/`, {
                headers: { Authorization: `Token ${user.token}` },
            })
            .then((response) => {
                setPost(response.data);
                setError(null);
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch product detail. Please try again later.");
                setLoading(false);
            });
        }
    }, [user, itemid]);

    useEffect(() => {
        if (user) {
            view();
        }
    }, [view, user]);

    const fetchPosts = useCallback(() => {
        axios.get("http://127.0.0.1:8000/listitem/", {
            headers: { Authorization: `Token ${user.token}` },
        })
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

    const loadingStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };

    const errorStyle = {
        color: "red",
        textAlign: "center",
        marginTop: "20px"
    };

    const productImageStyle = {
        width: "100%",
        height: "auto",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    };

    const productDetailsStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "10px"
    };

    const titleStyle = {
        marginBottom: "10px",
        fontWeight: "bold",
        fontSize: "1.5rem"
    };

    const subtitleStyle = {
        marginBottom: "10px",
        color: "#555",
        fontSize: "1.2rem"
    };

    const priceStyle = {
        marginBottom: "10px",
        fontWeight: "bold",
        fontSize: "1.3rem",
        color: "#d32f2f"
    };

    const sizeStyle = {
        marginBottom: "10px",
        fontWeight: "bold",
        fontSize: "1.1rem",
        color: "#333"
    };

    const buttonStyle = {
        width: "100%",
        maxWidth: "300px",
        padding: "10px",
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        textDecoration: "none",
        textAlign: "center"
    };

    if (loading) {
        return (
            <center style={loadingStyle}>
                <div className="spinner-border text-primary"></div>
            </center>
        );
    }

    if (error) {
        return <div style={errorStyle}>{error}</div>;
    }

    const addToCart = () => {
        axios.post(`http://127.0.0.1:8000/cart/add/${post.id}/`, {}, {
            headers: {
                Authorization: `Token ${user.token}`
            },
        })
        .then(response => {
            alert('Item added to cart');
        })
        .catch(error => {
            console.log(error);
            alert('Failed to add item to cart');
        });
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="row" style={{ width: "100%", maxWidth: "1200px", display: "flex", justifyContent: "center" }}>
                    <div className="col-md-5">
                        <img
                            src={`http://127.0.0.1:8000${post.image}`}
                            alt={post.model}
                            style={productImageStyle}
                        />
                    </div>
                    <div className="col-md-6" style={productDetailsStyle}>
                        <h3 style={titleStyle}>{post.model}</h3>
                        <h5 style={subtitleStyle}>{post.brand.name}</h5>
                        <h5 style={subtitleStyle}>{post.category.name}</h5>
                        <b style={priceStyle}>&#8377;{post.price}</b>
                        <b style={sizeStyle}>Size: {post.size}</b>
                        <Link onClick={addToCart} style={buttonStyle}>
                            Add To Cart <FontAwesomeIcon icon={faShoppingCart} style={{ marginLeft: "10px" }} />
                        </Link>
                    </div>
                </div><hr/><br/><br/><br/><br/>
                <div className="container mt-4">
                <div className="row">
                    {posts.map((item) => (
                        <div key={item.id} className="col-md-3" style={{ paddingLeft: "3px" }}>
                            <div className="card-lg mb-3">
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
                                    {item.model === "2023" && (
                                        <p style={{ color: "red", fontWeight: "bold" }}>
                                            Special Edition: 2023 Model
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
            
        </div>
    );
}

export default ViewDetail;
