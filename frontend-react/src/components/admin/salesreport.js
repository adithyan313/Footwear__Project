import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbaradmin from "../NavebarAdmin";
import CheckAdminAuth from "./checkadmin";

const SalesReport = () => {
    const user = useSelector((store) => store.auth.user);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [error, setError] = useState('');
    const [brandDate, setBrandDate] = useState('');
    const [brandEndDate, setBrandEndDate] = useState('');
    const [brandReportData, setBrandReportData] = useState([]);
    const [CategoryReportDate, setCategoryReportDate] = useState('');
    const [CategoryReportEndDate, setCategoryReportEndDate] = useState('');
    const [CategoryReportData, setCategoryReportData] = useState([]);

    useEffect(() => {
        if (startDate && endDate) {
            fetchReport();
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (brandDate && brandEndDate) {
            fetchBrandReport();
        }
    }, [brandDate, brandEndDate]);

    useEffect(() => {
        if (CategoryReportDate && CategoryReportEndDate) {
            fetchCategoryReport();
        }
    }, [CategoryReportDate, CategoryReportEndDate]);

    const fetchReport = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/reports/daily_sales/`, {
                params: {
                    start_date: startDate,
                    end_date: endDate
                },
                headers: { Authorization: `Token ${user.token}` },
            });
            setReportData(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch report. Please check the dates and try again.');
        }
    };

    const fetchBrandReport = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/reports/brand_sales/`, {
                params: {
                    start_date: brandDate,
                    end_date: brandEndDate
                },
                headers: { Authorization: `Token ${user.token}` },
            });
            setBrandReportData(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch brand report. Please check the dates and try again.');
        }
    };

    const fetchCategoryReport = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/reports/category_sales/`, {
                params: {
                    start_date: CategoryReportDate,
                    end_date: CategoryReportEndDate
                },
                headers: { Authorization: `Token ${user.token}` },
            });
            setCategoryReportData(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch category report. Please check the dates and try again.');
        }
    };

    const handleStartDate = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDate = (e) => {
        setEndDate(e.target.value);
    };

    const handleBrandDate = (e) => {
        setBrandDate(e.target.value);
    };

    const handleBrandEndDate = (e) => {
        setBrandEndDate(e.target.value);
    };

    const handleCategoryDate = (e) => {
        setCategoryReportDate(e.target.value);
    };

    const handleCategoryEndDate = (e) => {
        setCategoryReportEndDate(e.target.value);
    };

    const reportBoxStyle = {
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        marginBottom: '20px'
    };

    const hoverEffectStyle = {
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
    };

    const tableHoverStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
    };

    const tableHeaderStyle = {
        backgroundColor: '#f8f9fa'
    };

    const headingStyle = {
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px'
    };

    return (
        <div>
            <Navbaradmin />
            <div className="container mt-5">
                <Link to={`/listadmin`}>
                    <img src="/backback.png" alt="Todo List Icon" style={{ width: "40px", height: "35px", marginRight: "10px", marginTop: "20px", marginLeft: "20px" }} />
                </Link>
                <div className="row mt-4">
                    <div className="col-lg-6 mb-4">
                        <div
                            className="report-box"
                            style={reportBoxStyle}
                            onMouseEnter={(e) => e.currentTarget.style = hoverEffectStyle}
                            onMouseLeave={(e) => e.currentTarget.style = reportBoxStyle}
                        >
                            <h2 style={headingStyle}>Daily Sales Reports</h2>
                            <div className="d-flex justify-content-between mb-3">
                                <label className="w-50 mr-2">
                                    Start Date:
                                    <input type="date" value={startDate} onChange={handleStartDate} className="form-control" />
                                </label>
                                <label className="w-50 ml-2">
                                    End Date:
                                    <input type="date" value={endDate} onChange={handleEndDate} className="form-control" />
                                </label>
                            </div>
                            {error && <p className="text-danger">{error}</p>}
                            <table className="table table-hover">
                                <thead className="thead-light" style={tableHeaderStyle}>
                                    <tr>
                                        <th>Date</th>
                                        <th>Total Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((report, index) => (
                                        <tr key={index} style={tableHoverStyle}>
                                            <td>{report.date}</td>
                                            <td>{report.total_sales}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-6 mb-4">
                        <div
                            className="report-box"
                            style={reportBoxStyle}
                            onMouseEnter={(e) => e.currentTarget.style = hoverEffectStyle}
                            onMouseLeave={(e) => e.currentTarget.style = reportBoxStyle}
                        >
                            <h2 style={headingStyle}>Brand Sales Reports</h2>
                            <div className="d-flex justify-content-between mb-3">
                                <label className="w-50 mr-2">
                                    Start Date:
                                    <input type="date" value={brandDate} onChange={handleBrandDate} className="form-control" />
                                </label>
                                <label className="w-50 ml-2">
                                    End Date:
                                    <input type="date" value={brandEndDate} onChange={handleBrandEndDate} className="form-control" />
                                </label>
                            </div>
                            {error && <p className="text-danger">{error}</p>}
                            <table className="table table-hover">
                                <thead className="thead-light" style={tableHeaderStyle}>
                                    <tr>
                                        <th>Brand</th>
                                        <th>Total Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brandReportData.map((brand, index) => (
                                        <tr key={index} style={tableHoverStyle}>
                                            <td>{brand.brand}</td>
                                            <td>{brand.total_sales}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-lg-12">
                        <div
                            className="report-box"
                            style={reportBoxStyle}
                            onMouseEnter={(e) => e.currentTarget.style = hoverEffectStyle}
                            onMouseLeave={(e) => e.currentTarget.style = reportBoxStyle}
                        >
                            <h2 style={headingStyle}>Category Sales Reports</h2>
                            <div className="d-flex justify-content-center mb-3">
                                <label className="mr-2">
                                    Start Date:
                                    <input type="date" value={CategoryReportDate} onChange={handleCategoryDate} className="form-control" />
                                </label>
                                <label className="ml-2">
                                    End Date:
                                    <input type="date" value={CategoryReportEndDate} onChange={handleCategoryEndDate} className="form-control" />
                                </label>
                            </div>
                            {error && <p className="text-danger">{error}</p>}
                            <table className="table table-hover">
                                <thead className="thead-light" style={tableHeaderStyle}>
                                    <tr>
                                        <th>Category</th>
                                        <th>Total Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CategoryReportData.map((data, index) => (
                                        <tr key={index} style={tableHoverStyle}>
                                            <td>{data.category}</td>
                                            <td>{data.total_sales}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckAdminAuth(SalesReport);
