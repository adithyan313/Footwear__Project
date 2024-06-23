import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import ItemListPage from "./deleteitem";
import Navbaradmin from "../NavebarAdmin";
import CheckAdminAuth from "./checkadmin";

function ListAdmin(props) {
    const [admins, setAdmins] = useState([]);
    const user = useSelector((store) => store.auth.user);

    const featchpost = useCallback(() => {
        if (user) {
            axios.get("http://localhost:8000/listitemadmin/", {
                headers: { Authorization: `Token ${user.token}` },
            })
            .then((response) => {
                setAdmins(response.data);
            })
            .catch((error) => {
                console.error("Fild to fetch post:", error);
            })
        }
    }, [user]);

    useEffect(() => {
        featchpost();
    }, [featchpost]);

    return(
        <div>
            <Navbaradmin/>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-9">
                    {admins.length === 0 ? (
                        <h3 className="text-md-center">No matching items found.</h3>
                    ) : (
                        admins.map((item) => <ItemListPage key={item.id} item={item} refresh={featchpost} />)
                    )}
                </div>
            </div>
        </div>
        </div>
    );
}

export default CheckAdminAuth(ListAdmin);
