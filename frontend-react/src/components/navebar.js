/*import { NavLink } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "./store/authSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const Logout = () => {
        if (user) {
            axios
                .post(
                    "http://127.0.0.1:8000/logout/",
                    {},
                    {
                        headers: { Authorization: `Token ${user.token}` },
                    }
                )
                .then(() => {
                    dispatch(removeUser());
                    navigate("/");
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                });
        }
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="navbar-brand">
                <h4>Todo List</h4>
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className="collapse navbar-collapse"
                id="navbarNav"
            >
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                        <>
                        <li className="nav-item">
                                <NavLink to="/listproduct" className="nav-link">
                                
                                    list
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className="nav-link">
                               
                                    Login
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">
                                
                                    Sign Up
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" onClick={Logout}>
                                
                                    Logout
                                </NavLink>
                            </li>
                            
                        </>
                
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;*/
/*import { NavLink } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const Logout = () => {
        if (user) {
            axios
                .post(
                    "http://127.0.0.1:8000/logout/",
                    {},
                    {
                        headers: { Authorization: `Token ${user.token}` },
                    }
                )
                .then(() => {
                    dispatch(removeUser());
                    navigate("/");
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="navbar-brand">
                <h4>Todo List</h4>
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    <li className="nav-item">
                        <form onSubmit={handleSearch} className="form-inline">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button type="submit" className="btn btn-outline-success">
                                Search
                            </button>
                        </form>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/listproduct" className="nav-link">
                            List
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/login" className="nav-link">
                            Login
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link">
                            Sign Up
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" onClick={Logout}>
                            Logout
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;*/
/*import { NavLink } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FilterSidebar from "./productlist/FilterSidebar";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const Logout = () => {
        if (user) {
            axios
                .post(
                    "http://127.0.0.1:8000/logout/",
                    {},
                    {
                        headers: { Authorization: `Token ${user.token}` },
                    }
                )
                .then(() => {
                    dispatch(removeUser());
                    navigate("/");
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <nav className="navbar navbar-expand-md navbar-wight bg-wight">
            <div className="navbar-brand">
            <NavLink to="/" className="nav-link">
            <img src="/logo.png" alt="Todo List Icon" style={{ width: "150px", marginRight: "10px", height: "35px" }} /><img src="/high-heels.gif" alt="Todo List Icon" style={{ width: "40px", marginRight: "10px" }} />
            </NavLink>
            </div>
            <form onSubmit={handleSearch} className="form-inline">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button type="submit" className="btn btn-outline-success">
                                Search
                            </button>
                        </form>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <img src="/menu-bar1.png" alt="Todo List Icon" style={{ width: "40px", marginRight: "10px" }} />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    <li className="nav-item">
                        
                    </li>
                    <li className="nav-item-md">
                        <NavLink onClick={toggleFilter} className="nav-link-md">
                        <img src="/filter.gif" alt="Todo List Icon" style={{ width: "40px", marginRight: "10px" }} />
                        </NavLink>
                    </li>                    
                    {user ? (
                    <li className="nav-item-md">
                        <NavLink className="nav-link-md" onClick={Logout}>
                        <img src="/logout.gif" alt="Todo List Icon" style={{ width: "40px", marginRight: "10px" }} />
                        </NavLink>
                    </li>
                    ) : (
                    <li className="nav-item">
                        <NavLink to="/login" className="nav-link">
                        <img src="/login-.gif" alt="Todo List Icon" style={{ width: "40px", marginRight: "10px" }} />
                        </NavLink>
                    </li>
                    )}                    
                    <li className="nav-item">
                        <NavLink to="/cartlist" className="nav-link cart-icon">
                        <img src="/grocery.gif" alt="Todo List Icon" style={{ width: "40px", marginRight: "10px" }} />
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/myorder" className="nav-link">
                        <img src="/delivery-scooter.gif" alt="Todo List Icon" style={{ width: "40px", marginRight: "10px" }} />
                        </NavLink>
                    </li>
                </ul>
            </div>
            {isFilterOpen && <FilterSidebar toggleFilter={toggleFilter} />}
        </nav>
    );
}

export default Navbar;*/
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FilterSidebar from "./productlist/FilterSidebar";

function Navbar() {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const Logout = () => {
        if (user) {
            axios
                .post(
                    "http://127.0.0.1:8000/logout/",
                    {},
                    {
                        headers: { Authorization: `Token ${user.token}` },
                    }
                )
                .then(() => {
                    dispatch(removeUser());
                    navigate("/login");
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div>
            <style>
                {`
                    @keyframes firework {
                        0% { color: #fff; text-shadow: none; }
                        50% { color: #ffcc00; text-shadow: 0 0 10px rgba(255, 204, 0, 0.75); }
                        100% { color: #fff; text-shadow: none; }
                    }
                    .nav-link:hover {
                        animation: firework 0.5s ease-in-out forwards;
                    }
                `}
            </style>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="navbar-brand d-flex align-items-center">
                <NavLink to="/" className="nav-link d-flex align-items-center">
                    <img src="/logo.png" alt="Todo List Icon" style={{ width: "150px", height: "35px", marginRight: "10px" }} />
                    <img src="/logoneed.gif" alt="Todo List Icon" style={{ width: "50px", marginRight: "10px" }} />
                </NavLink>
            </div>
            <form onSubmit={handleSearch} className="form-inline mr-auto bg-dark">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <button type="submit" className="btn btn-outline-success">
                    Search
                </button>
            </form>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <img src="/menu-bar1.png" alt="Todo List Icon" style={{ width: "40px" }} />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    <li className="nav-item">
                        <NavLink onClick={toggleFilter} className="nav-link">
                            Filter
                        </NavLink>
                    </li>&nbsp;
                    {user ? (
                        <li className="nav-item">
                            <NavLink className="nav-link" onClick={Logout}>
                                Logout
                            </NavLink>
                        </li>
                    ) : (
                        <li className="nav-item" style={{paddingLeft: "10px"}}>
                            <NavLink to="/login" className="nav-link">
                                Login
                            </NavLink>
                        </li>
                    )}
                    <li className="nav-item">
                        <NavLink to="/cartlist" className="nav-link">
                                Cart
                        </NavLink>
                    </li>&nbsp;
                    <li className="nav-item">
                        <NavLink to="/myorder" className="nav-link">
                            MyOrder
                        </NavLink>
                    </li>&nbsp;
                </ul>
            </div>
            {isFilterOpen && <FilterSidebar toggleFilter={toggleFilter} />}
        </nav>
        </div>
    );
}

export default Navbar;




