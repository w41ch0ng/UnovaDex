import { useState } from "react";
import redXbutton from "../images/sprites/redxbutton.png";
import { SearchBarProps } from "../utils/interfaces";

function SearchBar({ onSearch, allPokemon }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle clearing the search input
  const handleClearSearch = () => {
    setSearchTerm(""); // Clears the search term by setting it to an empty string
    // Calls the 'onSearch' function with an empty search term to reset the search results
    onSearch("", allPokemon);
  };

  // Function to handle changes in the search input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Retrieves the new search term from the input field's value
    const newSearchTerm = e.target.value;
    // Updates the searchTerm state with the new search term
    setSearchTerm(newSearchTerm);
    // Calls the 'onSearch' function with the new search term and all Pokémon data
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
