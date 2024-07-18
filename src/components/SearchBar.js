import React, { useState } from "react";
import redXbutton from "../images/sprites/redxbutton.png";

function SearchBar({ onSearch, allPokemon }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm, allPokemon);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("", allPokemon);
  };

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm, allPokemon);
  };

  return (
    <div className="search-bar-container">
      <div className="search-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <button className="clear-button" onClick={handleClearSearch}>
            <img src={redXbutton} alt="Clear Search" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
