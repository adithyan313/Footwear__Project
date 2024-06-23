import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import CheckAdminAuth from "./checkadmin";

function ItemListPage(props) {
    const user = useSelector((store) => store.auth.user);
    const [responseMessage, setResponseMessage] = useState('');

    function deleteitem() {
        axios.delete(`http://localhost:8000/delete/${props.item.id}/`, {
            headers: { Authorization: `Token ${user.token}` },
        })
        .then((response) => {
            setResponseMessage(response.data.message);
            props.refresh();
        })
        .catch((error) => {
            console.error("Error delete post:", error);
            setResponseMessage("Faild to delete post:");
            alert("your are not allowed to delete this post.");
        });
    }

    return(
        <div>
        <div>
            <div className="card">
                <div className="card-body">
                <img
                                        className="card-img-top"
                                        src={`http://127.0.0.1:8000${props.item.image}`}
                                        alt="Product"
                                        style={{
                                            width: "90px", 
                                            height: "60px", 
                                            borderRadius: "5px" 
                                        }}
                                    /> &nbsp; &nbsp; &nbsp;
                    <b>{props.item.model}</b>
                    <b style={{paddingLeft: "49px"}}>Stocks:{props.item.stock}</b>
                    <button className="btn btn-danger float-right" onClick={deleteitem}>
                        delete
                    </button>
                    <Link to={`/edititem/${props.item.id}`} className="btn btn-primary float-right">
                    Edit
                    </Link>
                </div>
            </div>
        </div>
        </div>
    );
}
export default CheckAdminAuth(ItemListPage); 