// App.js
import React, { useState } from "react";
import Navbar from "./components/navebar"; // Ensure correct path
import SearchResult from "./components/productlist/searchresult"; // Ensure correct path

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (results) => {
    console.log('handleSearch called with:', results); // Add this line to debug
    setSearchResults(results);
  };

  console.log('App component render, handleSearch:', handleSearch); // Add this line to debug

  return (
    <div>
      <h1>Footwear Search</h1>
      <Navbar onSearch={handleSearch} /> {/* Passing handleSearch as onSearch prop */}
      <SearchResult results={searchResults} />
    </div>
  );
}

export default App;
