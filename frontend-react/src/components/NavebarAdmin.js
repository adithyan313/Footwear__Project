import { NavLink } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "./store/authSlice";
import { useNavigate } from "react-router-dom";

function Navbaradmin() {
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
                    navigate('/login');
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                });
        }
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
                    <NavLink to="/listadmin" className="nav-link d-flex align-items-center">
                        <img src="/Admin.png" alt="Todo List Icon" style={{ width: "50px", height: "45px", marginRight: "10px" }} />
                    </NavLink>
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
                    <img src="/menu-bar1.png" alt="Todo List Icon" style={{ width: "40px" }} />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                        {user ? (
                            <li className="nav-item">
                                <NavLink className="nav-link" onClick={Logout}>
                                    Logout
                                </NavLink>
                            </li>
                        ) : (
                            <li className="nav-item" style={{ paddingLeft: "10px" }}>
                                <NavLink to="/login" className="nav-link">
                                    Login
                                </NavLink>
                            </li>
                        )}
                        <li className="nav-item">
                            <NavLink to="/addfootwear" className="nav-link">
                                AddProduct
                            </NavLink>
                        </li>&nbsp;
                        <li class="nav-item">
                            <NavLink to="/salesreport" className="nav-link">
                                SalesReport
                            </NavLink>
                        </li>&nbsp;
                        <li className="nav-item">
                            <NavLink to="/lowstockmanager" className="nav-link">
                                LowStockManage
                            </NavLink>
                        </li>&nbsp;
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbaradmin;
