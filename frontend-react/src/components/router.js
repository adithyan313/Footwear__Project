import { createBrowserRouter } from "react-router-dom";

import Register from "./auth/signup";
import ListProduct from "./productlist/listproduct";
import SearchResults from "./productlist/SearchResults";
import SearchFilter from "./productlist/SearchFilter";
import ViewDetail from "./productlist/viewdetai";
import Cart from "./productlist/CartLiatItem";
import OrderHistory from "./productlist/myorder";
import AddFootwear from "./admin/createproduct";
import ListAdmin from "./admin/listitemforadmin";
import EditItem from "./admin/EditItem";
import SalesReport from "./admin/salesreport";
import LowStockManager from "./admin/lostack";

const router = createBrowserRouter([
    {path: '', element: <ListProduct/>},
    {path: 'login', element: <Register/>},
    {path: 'search', element: <SearchResults/>},
    {path: 'searchfilter', element: <SearchFilter/>},
    {path: 'viewdetail/:itemid', element: <ViewDetail/>},
    {path: 'cartlist/', element: <Cart/>},
    {path: 'myorder', element: <OrderHistory/>},
    {path: 'addfootwear', element: <AddFootwear/>},
    {path: 'listadmin', element: <ListAdmin/>},
    {path: 'edititem/:itemid', element: <EditItem/>},
    {path: 'salesreport', element: <SalesReport/>},
    {path: 'lowstockmanager', element: <LowStockManager/>},
]);
export default router;