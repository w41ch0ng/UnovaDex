import html2canvas from "html2canvas";
import hoverSound from "../sfx/pokemonbwscrollsound.mp3";
import pokeball from "../images/pokeballs/Poke_Ball.png";
import greatball from "../images/pokeballs/Great_Ball.png";
import ultraball from "../images/pokeballs/Ultra_Ball.png";
import masterball from "../images/pokeballs/Master_Ball.png";
import cherishball from "../images/pokeballs/Cherish_Ball.png";
import diveball from "../images/pokeballs/Dive_Ball.png";
import dreamball from "../images/pokeballs/Dream_Ball.png";
import duskball from "../images/pokeballs/Dusk_Ball.png";
import fastball from "../images/pokeballs/Fast_Ball.png";
import friendball from "../images/pokeballs/Friend_Ball.png";
import healball from "../images/pokeballs/Heal_Ball.png";
import heavyball from "../images/pokeballs/Heavy_Ball.png";
import levelball from "../images/pokeballs/Level_Ball.png";
import loveball from "../images/pokeballs/Love_Ball.png";
import lureball from "../images/pokeballs/Lure_Ball.png";
import luxuryball from "../images/pokeballs/Luxury_Ball.png";
import moonball from "../images/pokeballs/Moon_Ball.png";
import nestball from "../images/pokeballs/Nest_Ball.png";
import netball from "../images/pokeballs/Net_Ball.png";
import parkball from "../images/pokeballs/Park_Ball.png";
import premierball from "../images/pokeballs/Premier_Ball.png";
import quickball from "../images/pokeballs/Quick_Ball.png";
import repeatball from "../images/pokeballs/Repeat_Ball.png";
import safariball from "../images/pokeballs/Safari_Ball.png";
import sportball from "../images/pokeballs/Sport_Ball.png";
import timerball from "../images/pokeballs/Timer_Ball.png";

//   !!!POKELIST!!!   //

// Type images map
export const typeImageMap = {
  water: "water.png",
  fire: "fire.png",
  grass: "grass.png",
  bug: "bug.png",
  dark: "dark.png",
  dragon: "dragon.png",
  electric: "electric.png",
  fairy: "fairy.png",
  fighting: "fighting.png",
  flying: "flying.png",
  ghost: "ghost.png",
  ground: "ground.png",
  ice: "ice.png",
  normal: "normal.png",
  poison: "poison.png",
  psychic: "psychic.png",
  rock: "rock.png",
  steel: "steel.png",
};

// Function to get the type image based on the type name
export const getTypeImage = (typeName) => {
  try {
    return require(`../images/typeimages/${
      typeImageMap[typeName.toLowerCase()]
    }`);
  } catch (error) {
    console.log("Error returning type images.");
    return null;
  }
};

// Damage class images map
export const dmgClassImageMap = {
  physical: "physical.png",
  special: "special.png",
  status: "status.png",
};

// Function to get the damage class image based on the damage class name
export const getDmgClassImage = (damageClass) => {
  try {
    return require(`../images/dmgclassimages/${
      dmgClassImageMap[damageClass.toLowerCase()]
    }`);
  } catch (error) {
    console.error("Error loading damage class image:", error);
    return null;
  }
};

// Function to fetch data with retry logic
const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
  // Loop 3 times for 3 retries
  for (let i = 0; i < retries; i++) {
    try {
      // Attempt to fetch the URL
      const res = await fetch(url);
      const status = res.status; // Get the response status code
      const text = await res.text(); // Get the response body as text

      // Check if the response is not OK (status code not in range 200-299)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${status}, body: ${text}`);
      }

      // Check if the response body is empty
      if (!text) {
        throw new Error(`Empty response body for URL: ${url}`);
      }

      let data;
      try {
        // Attempt to parse the response body as JSON
        data = JSON.parse(text);
      } catch (jsonError) {
        // Throw an error if the JSON parsing fails
        throw new Error(`Invalid JSON response for URL: ${url}, body: ${text}`);
      }

      // Return the parsed JSON data
      return data;
    } catch (error) {
      // Log the error message for a failed entry fetch attempt
      console.error(`Fetch error for ${url}: ${error.message}`);
      // If the maximum number of retries has been reached, log the message and return null
      if (i === retries - 1) {
        console.error(`Max retries reached for URL: ${url}`);
        return null; // Return null to indicate a failed fetch
      }
      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Function to fetch all Pokémon data and set it in the allPokemon state
export const getAllPokemon = async (setAllPokemon) => {
  try {
    // Fetch the main Pokémon list with the fetch with retry function
    const res = await fetchWithRetry(
      "https://pokeapi.co/api/v2/pokemon?limit=649&offset=0"
    );
    console.log("Fetched main Pokémon list:", res);

    // Extract the URLs of individual Pokémon from the main list
    const pokemonUrls = res.results.map((pokemon) => pokemon.url);

    // Create an array of promises to fetch data for each individual Pokémon
    const pokemonDataPromises = pokemonUrls.map((url) => fetchWithRetry(url));

    // Wait for all promises to resolve
    const pokemonDataResults = await Promise.all(pokemonDataPromises);

    // Filter out any null results from the array
    const pokemonData = pokemonDataResults.filter((data) => data !== null);

    console.log("Fetched individual Pokémon data:", pokemonData);

    // Create an array of promises to fetch data for alternate forms of Pokémon
    const alternateFormesPromises = Object.values(alternateFormesMapping).map(
      (formeName) =>
        fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${formeName}`)
    );

    // Wait for all alternate form promises to resolve
    const alternateFormesDataResults = await Promise.all(
      alternateFormesPromises
    );

    // Filter out any null results from the alternate forms array
    const alternateFormesData = alternateFormesDataResults.filter(
      (data) => data !== null
    );

    console.log("Fetched alternate forms data:", alternateFormesData);

    // Merge the main Pokémon data with the alternate forms data
    const mergedData = pokemonData.concat(alternateFormesData);

    // Sort the merged data by Pokémon ID in ascending order
    mergedData.sort((a, b) => a.id - b.id);

    // Update the state with the merged and sorted Pokémon data
    setAllPokemon(mergedData);
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
  }
};

// Function to search for Pokémon from search bar
export const searchPokemon = (searchTerm, allPokemon, setSearchedPokemon) => {
  /* Filter the Pokémon list by checking if their name includes the
  search term (case insensitive) */
  const filteredPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Update the state with the filtered list of Pokémon
  setSearchedPokemon(filteredPokemon);
};

// Function to fetch the Black and White (BW) Unova Pokédex data
export const fetchBWUnovaPokedex = async () => {
  try {
    // Fetch data from the BW Pokédex endpoint
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/8");
    const data = await res.json(); // Parse the response as JSON
    // Extract and return the names of the Pokémon species from the data
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching BW Unova Pokedex data:", error);
    return []; // Return an empty array in case of error
  }
};

// Function to fetch the Black and White 2 (BW2) Unova Pokédex data
export const fetchBW2UnovaPokedex = async () => {
  try {
    // Fetch data from the BW2 Pokédex endpoint
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/9");
    const data = await res.json(); // Parse the response as JSON
    // Extract and return the names of the Pokémon species from the data
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching BW2 Unova Pokedex data:", error);
    return []; // Return an empty array in case of error
  }
};

// Function to fetch the National Pokédex data
export const fetchNationalPokedex = async () => {
  try {
    // Fetch data from the National Pokédex endpoint
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/1");
    const data = await res.json(); // Parse the response as JSON
    // Extract and return the names of the Pokémon species from the data
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching National Pokedex data:", error);
    return []; // Return an empty array in case of error
  }
};

// Function to toggle between game types and update the Pokédex type accordingly
export const toggleGameType = (setGameType, setPokedexType) => {
  // Update the game type state
  setGameType((prevType) => {
    // Determine the new game type based on the previous game type
    const newGameType = prevType === "bw" ? "bw2" : "bw";

    // Update the Pokédex type state based on the new game type
    setPokedexType((prevPokedexType) => {
      if (newGameType === "bw") {
        // Toggle between "bwRegional" and "national" for BW game type
        return prevPokedexType === "bwRegional" ? "national" : "bwRegional";
      } else if (newGameType === "bw2") {
        // Toggle between "bw2Regional" and "national" for BW2 game type
        return prevPokedexType === "bw2Regional" ? "national" : "bw2Regional";
      }
      return prevPokedexType; // Return the previous Pokédex type if no changes
    });

    return newGameType; // Return the updated game type
  });
};

// Function to toggle the Pokédex type based on the current game type and Pokédex type
export const togglePokedexType = (setPokedexType, pokedexType, gameType) => {
  if (gameType === "bw") {
    // Toggle between "bwRegional" and "national" for BW game type
    if (pokedexType === "bwRegional") {
      setPokedexType("national");
    } else if (pokedexType === "national") {
      setPokedexType("bwRegional");
    }
  } else if (gameType === "bw2") {
    // Toggle between "bw2Regional" and "national" for BW2 game type
    if (pokedexType === "bw2Regional") {
      setPokedexType("national");
    } else if (pokedexType === "national") {
      setPokedexType("bw2Regional");
    }
  }
};

/* BW alternate formes to standard name map for correct parsing
 when fetching data */
const nationalToBWPokemonMapping = {
  "basculin-blue-striped": "basculin",
  "basculin-red-striped": "basculin",
  "darmanitan-standard": "darmanitan",
  "darmanitan-zen": "darmanitan",
  "landorus-incarnate": "landorus",
  "tornadus-incarnate": "tornadus",
  "thundurus-incarnate": "thundurus",
  "meloetta-aria": "meloetta",
  "meloetta-pirouette": "meloetta",
  "keldeo-ordinary": "keldeo",
  "keldeo-resolute": "keldeo",
  "deoxys-normal": "deoxys",
  "deoxys-attack": "deoxys",
  "deoxys-defense": "deoxys",
  "deoxys-speed": "deoxys",
  "rotom-heat": "rotom",
  "rotom-wash": "rotom",
  "rotom-frost": "rotom",
  "rotom-fan": "rotom",
  "rotom-mow": "rotom",
  "giratina-origin": "giratina",
  "giratina-altered": "giratina",
  "shaymin-land": "shaymin",
  "shaymin-sky": "shaymin",
};

/* BW2 alternate formes to standard name map for correct parsing
 when fetching data */
export const nationalToBW2PokemonMapping = {
  "basculin-blue-striped": "basculin",
  "basculin-red-striped": "basculin",
  "darmanitan-standard": "darmanitan",
  "darmanitan-zen": "darmanitan",
  "landorus-incarnate": "landorus",
  "landorus-therian": "landorus",
  "tornadus-incarnate": "tornadus",
  "tornadus-therian": "tornadus",
  "thundurus-incarnate": "thundurus",
  "thundurus-therian": "thundurus",
  "meloetta-aria": "meloetta",
  "meloetta-pirouette": "meloetta",
  "keldeo-ordinary": "keldeo",
  "keldeo-resolute": "keldeo",
  "kyurem-black": "kyurem",
  "kyurem-white": "kyurem",
  "deoxys-normal": "deoxys",
  "deoxys-attack": "deoxys",
  "deoxys-defense": "deoxys",
  "deoxys-speed": "deoxys",
  "rotom-heat": "rotom",
  "rotom-wash": "rotom",
  "rotom-frost": "rotom",
  "rotom-fan": "rotom",
  "rotom-mow": "rotom",
  "giratina-origin": "giratina",
  "giratina-altered": "giratina",
  "shaymin-land": "shaymin",
  "shaymin-sky": "shaymin",
};

export const filterPokemonByPokedexType = (
  pokemonArray,
  pokedexType,
  gameType,
  bwUnovaPokedex,
  bw2UnovaPokedex,
  nationalPokedex
) => {
  let filteredPokemon = []; // Initialise an empty array for filtered Pokémon

  if (pokedexType === "bwRegional") {
    filteredPokemon = pokemonArray
      .filter((pokemonStats) => {
        // Filter Pokémon based on BW Unova Pokédex
        const bwName =
          // Map to BW name if needed
          nationalToBWPokemonMapping[pokemonStats.name] || pokemonStats.name;
        // Check if the Pokémon is in the BW Unova Pokédex
        return bwUnovaPokedex.includes(bwName);
      })
      .map((pokemonStats) => {
        // Map filtered Pokémon to add their BW Unova Pokédex ID
        const bwName =
          nationalToBWPokemonMapping[pokemonStats.name] || pokemonStats.name;
        // Get the index in the BW Unova Pokédex
        const idInBW = bwUnovaPokedex.indexOf(bwName);
        // Pad ID with zeros and add to stats
        return { ...pokemonStats, id: idInBW.toString().padStart(3, "0") };
      })
      .sort((a, b) => a.id - b.id); // Sort by ID
  } else if (pokedexType === "national") {
    if (gameType === "bw") {
      filteredPokemon = pokemonArray
        .filter((pokemonStats) => {
          // Filter Pokémon based on National Pokédex with nationalToBWPokemon map
          const bwName =
            nationalToBWPokemonMapping[pokemonStats.name] || pokemonStats.name;
          // Check if the Pokémon is in the National Pokédex
          return nationalPokedex.includes(bwName);
        })
        .map((pokemonStats) => {
          // Map filtered Pokémon to add their National Pokédex ID
          const bwName =
            nationalToBWPokemonMapping[pokemonStats.name] || pokemonStats.name;
          // Get the index in the National Pokédex
          const nationalId = nationalPokedex.indexOf(bwName);
          // Pad ID with zeros and add to stats
          return {
            ...pokemonStats,
            id: (nationalId + 1).toString().padStart(3, "0"),
          };
        })
        .sort((a, b) => a.id - b.id); // Sort by ID
    } else if (gameType === "bw2") {
      filteredPokemon = pokemonArray
        .filter((pokemonStats) => {
          // Filter Pokémon based on National Pokédex with nationalToBW2Pokemon map
          const bw2Name =
            nationalToBW2PokemonMapping[pokemonStats.name] || pokemonStats.name;
          // Check if the Pokémon is in the National Pokédex
          return nationalPokedex.includes(bw2Name);
        })
        .map((pokemonStats) => {
          // Map filtered Pokémon to add their National Pokédex ID
          const bw2Name =
            nationalToBW2PokemonMapping[pokemonStats.name] || pokemonStats.name;
          // Get the index in the National Pokédex
          const nationalId = nationalPokedex.indexOf(bw2Name);
          // Pad ID with zeros and add to stats
          return {
            ...pokemonStats,
            id: (nationalId + 1).toString().padStart(3, "0"),
          };
        })
        .sort((a, b) => a.id - b.id); // Sort by ID
    }
  } else if (pokedexType === "bw2Regional") {
    filteredPokemon = pokemonArray
      .filter((pokemonStats) => {
        // Filter Pokémon based on BW2 Unova Pokédex
        const bw2Name =
          nationalToBW2PokemonMapping[pokemonStats.name] || pokemonStats.name;
        // Check if the Pokémon is in the BW2 Unova Pokédex
        return bw2UnovaPokedex.includes(bw2Name);
      })
      .map((pokemonStats) => {
        // Map filtered Pokémon to add BW2 Unova Pokédex ID
        const bw2Name =
          nationalToBW2PokemonMapping[pokemonStats.name] || pokemonStats.name;
        // Get the index in the BW2 Unova Pokédex
        const idInBW2 = bw2UnovaPokedex.indexOf(bw2Name);
        // Pad ID with zeros and add to stats
        return { ...pokemonStats, id: idInBW2.toString().padStart(3, "0") };
      })
      .sort((a, b) => a.id - b.id); // Sort by ID
  }

  return filteredPokemon; // Return the filtered and sorted Pokémon array
};

// Function to get the move sets of a Pokémon
export const getMoveSets = (pokemonMoves) => {
  return pokemonMoves.map((move) => move.move.name); // Map each move to its name
};

// Function to get the abilities of a Pokémon
export const getAbilities = (pokemonAbilities) => {
  // Map each ability to its name
  return pokemonAbilities.map((ability) => ability.ability.name);
};

// Function to get the types of a Pokémon
export const getPokemonTypes = (pokemonStats) => {
  /* Check if the Pokémon is a form of Rotom. A separate function is written for
  Rotom specifically as its multiple formes with different types was causing
  issues when fetching all formes */
  const isRotom = pokemonStats.name.startsWith("rotom-");

  // If it is, join type names with a comma
  if (isRotom) {
    return (pokemonStats.types || []).map((type) => type.type.name).join(", ");
  }

  const hasPastTypes =
    pokemonStats.past_types &&
    Array.isArray(pokemonStats.past_types) &&
    pokemonStats.past_types.length > 0; // Check if the Pokémon has past types

  if (hasPastTypes) {
    return pokemonStats.past_types
      .map((pastType) =>
        pastType.types.map((type) => type.type.name).join(", ")
      )
      .join(", "); // If it does, join past type names with a comma
  } else {
    // If not, join current type names with a comma
    return (pokemonStats.types || []).map((type) => type.type.name).join(", ");
  }
};

// Function to get the type images for a Pokémon
export const getPokemonTypeImages = (pokemonStats) => {
  // Check if the Pokémon is a form of Rotom
  const isRotom = pokemonStats.name.startsWith("rotom-");

  if (isRotom) {
    return (pokemonStats.types || []).map((type) => ({
      image: getTypeImage(type.type.name), // Get the type image for each type
    }));
  }

  const hasPastTypes =
    pokemonStats.past_types &&
    Array.isArray(pokemonStats.past_types) &&
    pokemonStats.past_types.length > 0; // Check if the Pokémon has past types

  if (hasPastTypes) {
    return pokemonStats.past_types.map((pastType) => ({
      image: getTypeImage(
        pastType.types.map((type) => type.type.name).join(", ")
      ),
    })); // If it does, get the type image for each past type
  } else {
    return (pokemonStats.types || []).map((type) => ({
      image: getTypeImage(type.type.name),
    })); // If not, get the type image for each current type
  }
};

// Function to fetch all natures and update the allNatures state
export const getAllNatures = async (setAllNatures) => {
  try {
    const res = await fetch(
      "https://pokeapi.co/api/v2/nature?limit=25&offset=0"
    ); // Fetch nature data from nature API endpoint
    const data = await res.json(); // Parse the response as JSON
    // Get URLs for each nature
    const natureUrls = data.results.map((nature) => nature.url);

    const natureDataPromises = natureUrls.map(async (url) => {
      const res = await fetch(url); // Fetch data for each nature
      return res.json(); // Parse the response as JSON
    });

    // Wait for all fetch promises to resolve
    const natureData = await Promise.all(natureDataPromises);
    natureData.sort((a, b) => a.id - b.id); // Sort natures by ID

    setAllNatures(natureData); // Update the state with fetched natures
  } catch (error) {
    console.error("Error fetching nature data:", error);
  }
};

// Alternate formes name map for correct parsing when fetching data
export const alternateFormesMapping = {
  "landorus-therian": "landorus-therian",
  "tornadus-therian": "tornadus-therian",
  "thundurus-therian": "thundurus-therian",
  "kyurem-black": "kyurem-black",
  "kyurem-white": "kyurem-white",
  "deoxys-attack": "deoxys-attack",
  "deoxys-defense": "deoxys-defense",
  "deoxys-speed": "deoxys-speed",
  "rotom-heat": "rotom-heat",
  "rotom-wash": "rotom-wash",
  "rotom-frost": "rotom-frost",
  "rotom-fan": "rotom-fan",
  "rotom-mow": "rotom-mow",
  "giratina-origin": "giratina-origin",
  "shaymin-sky": "shaymin-sky",
  "keldeo-resolute": "keldeo-resolute",
  "meloetta-pirouette": "meloetta-pirouette",
  "darmanitan-zen": "darmanitan-zen",
  "basculin-blue-striped": "basculin-blue-striped",
};

// Function to capitalise each word and join with '-', mainly used for Pokémon names
export const capitaliseEachWord = (str) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
};

// Function to update the total number of Pokémon value based on the Pokédex type
export const getPokedexTypeNumber = (pokedexType) => {
  if (pokedexType === "bwRegional") {
    return "156";
  } else if (pokedexType === "bw2Regional") {
    return "301";
  } else if (pokedexType === "national") {
    return "649";
  }
};

//   !!!POKEMONCARD!!!   //

// Function to play hover sound when hovering over a Pokémon card
export const playHoverSound = () => {
  const audio = new Audio(hoverSound);
  audio.play().catch((error) => {
    console.error("Error playing audio:", error.message);
  });
};

//      !!!TEAMBUILDER!!!     //

// Default value declarations for team builder slots
export const teamItem = {
  pokemon: null,
  isShiny: false,
};

// Function to add a Pokémon to the team builder
export const addToTeam = (pokemon, team, setTeam) => {
  // If the team has less than 6 Pokémon, get the Pokémon, add it, and update team state
  if (team.length < 6 && !team.find((item) => item.pokemon === pokemon)) {
    setTeam([...team, { ...teamItem, pokemon }]);
  }
};

// Function to remove a Pokémon from the team builder
export const removeFromTeam = (pokemon, team, setTeam) => {
  // Filter the team array to exclude the selected Pokémon
  const updatedTeam = team.filter((item) => item.pokemon !== pokemon);
  // Update the team state with the filtered array
  setTeam(updatedTeam);
};

// Function to toggle the shiny status of a Pokémon in the team
export const toggleShiny = (pokemon, team, setTeam) => {
  // Map through the team array and toggle the isShiny property for the specified Pokémon
  const updatedTeam = team.map((item) => {
    if (item.pokemon === pokemon) {
      // Return a new object with the toggled isShiny property
      return { ...item, isShiny: !item.isShiny };
    }
    // Return the item unchanged if it's not the selected Pokémon
    return item;
  });
  // Update the team state with the modified array
  setTeam(updatedTeam);
};

// Function to capture the team builder container as an image
export const captureTeamBuilder = () => {
  // Get the team builder container element by its ID
  const teamBuilderContainer = document.getElementById("capture");

  // Set the background image of the team builder container
  teamBuilderContainer.style.backgroundImage =
    "url('src/images/BW2BACKGROUND.png')";

  if (teamBuilderContainer) {
    // Use html2canvas to capture the container as a canvas
    html2canvas(teamBuilderContainer, {
      allowTaint: true, // Allow cross-origin images
      useCORS: true, // Use CORS to load images
    }).then((canvas) => {
      // Convert the canvas to a data URL in PNG format
      const imageDataUrl = canvas.toDataURL("image/png");

      // Create a download link element
      const downloadLink = document.createElement("a");
      // Set the href to the image data URL
      downloadLink.href = imageDataUrl;
      // Set the download attribute to the desired file name
      downloadLink.download = "team_builder_capture.png";

      // Clicks the download link to trigger the download
      downloadLink.click();
    });
  }
};

// Function to toggle the visibility of a dropdown menu
export const toggleDropdown = (
  index,
  isDropdownVisible,
  setDropdownVisible
) => {
  // Copy of the visibility array
  const updatedDropdowns = [...isDropdownVisible];
  // Toggle the visibility of the dropdown at the selected index
  updatedDropdowns[index] = !updatedDropdowns[index];
  // Update the dropdownVisible state with the modified visibility array
  setDropdownVisible(updatedDropdowns);
};

// Function to handle the selection of a Pokéball type for a Pokémon
export const handlePokeballSelection = (
  pokemonName,
  pokeballType,
  setSelectedPokeballs
) => {
  // Update the selected Pokéballs state with the new selection
  setSelectedPokeballs((prevSelected) => ({
    ...prevSelected, // Spread the previous selections
    [pokemonName]: pokeballType, // Add/update the selection for the selected Pokémon
  }));
};

// Pokéball types images map
export const pokeballTypes = [
  { type: "pokeball", image: pokeball },
  { type: "greatball", image: greatball },
  { type: "ultraball", image: ultraball },
  { type: "masterball", image: masterball },
  { type: "cherishball", image: cherishball },
  { type: "diveball", image: diveball },
  { type: "dreamball", image: dreamball },
  { type: "duskball", image: duskball },
  { type: "fastball", image: fastball },
  { type: "friendball", image: friendball },
  { type: "healball", image: healball },
  { type: "heavyball", image: heavyball },
  { type: "levelball", image: levelball },
  { type: "loveball", image: loveball },
  { type: "lureball", image: lureball },
  { type: "luxuryball", image: luxuryball },
  { type: "moonball", image: moonball },
  { type: "nestball", image: nestball },
  { type: "netball", image: netball },
  { type: "parkball", image: parkball },
  { type: "premierball", image: premierball },
  { type: "quickball", image: quickball },
  { type: "repeatball", image: repeatball },
  { type: "safariball", image: safariball },
  { type: "sportball", image: sportball },
  { type: "timerball", image: timerball },
];

// Function to get Pokéball image based on Pokéball type
export const getSelectedPokeballImage = (pokeballType) => {
  switch (pokeballType) {
    case "greatball":
      return greatball;
    case "ultraball":
      return ultraball;
    case "masterball":
      return masterball;
    case "cherishball":
      return cherishball;
    case "diveball":
      return diveball;
    case "dreamball":
      return dreamball;
    case "duskball":
      return duskball;
    case "fastball":
      return fastball;
    case "friendball":
      return friendball;
    case "healball":
      return healball;
    case "heavyball":
      return heavyball;
    case "levelball":
      return levelball;
    case "loveball":
      return loveball;
    case "lureball":
      return lureball;
    case "luxuryball":
      return luxuryball;
    case "moonball":
      return moonball;
    case "nestball":
      return nestball;
    case "netball":
      return netball;
    case "parkball":
      return parkball;
    case "premierball":
      return premierball;
    case "quickball":
      return quickball;
    case "repeatball":
      return repeatball;
    case "safariball":
      return safariball;
    case "sportball":
      return sportball;
    case "timerball":
      return timerball;
    default:
      return pokeball;
  }
};

// Function to open modal of selected Pokémon
export const openModal = (pokemon, setSelectedPokemon, setModalIsOpen) => {
  setSelectedPokemon(pokemon); // Set selectedPokemon state to selected Pokémon
  setModalIsOpen(true); // Set modalIsOpen state to true
};

// Function to handle the selection of a move for a Pokémon
export const handleMoveSelection = (
  pokemon,
  selectedMove,
  dropdownIndex,
  selectedMoves,
  setSelectedMoves
) => {
  // Create a copy of the current selected moves
  const updatedSelectedMoves = { ...selectedMoves };

  /* If the Pokémon does not have any moves selected yet, initialise
  an empty object for it */
  if (!updatedSelectedMoves[pokemon.name]) {
    updatedSelectedMoves[pokemon.name] = {};
  }

  // Set the selected move for the Pokémon at the chosen dropdown index
  updatedSelectedMoves[pokemon.name][dropdownIndex] = selectedMove;

  // Update the state with the new selected moves
  setSelectedMoves(updatedSelectedMoves);
};

// Function to handle changing the name of a Pokémon in the name bar
export const handleNameChange = (
  pokemon,
  currentEditedNames,
  newName,
  setEditedNames
) => {
  // Update the state with the new name for the specified Pokémon
  setEditedNames((prevNames) => ({
    ...prevNames, // Spread the previous names to maintain existing entries
    [pokemon.name]: newName, // Set the new name for the specified Pokémon
  }));
};

// Function to get the stats affected by a chosen nature
export const getAffectedStats = (natureName, allNatures) => {
  // If no nature is specified, return default values indicating no stat changes
  if (!natureName) {
    return { increasedStat: "", decreasedStat: "", noStatChanges: true };
  }

  // Find the nature object corresponding to the given nature name
  const nature = allNatures.find((n) => n.name === natureName);

  // If the nature is not found, return default values indicating no stat changes
  if (!nature) {
    return { increasedStat: "", decreasedStat: "", noStatChanges: true };
  }

  // Determine the increased stat based on the nature object
  const increasedStat =
    nature.increased_stat && nature.increased_stat.name
      ? `+${nature.increased_stat.name}`
      : "";

  // Determine the decreased stat based on the nature object
  const decreasedStat =
    nature.decreased_stat && nature.decreased_stat.name
      ? ` -${nature.decreased_stat.name}`
      : "";

  // Return the affected stats and a flag indicating if there are no stat changes
  return {
    increasedStat,
    decreasedStat,
    noStatChanges: !increasedStat && !decreasedStat,
  };
};

//      !!!MODAL!!!     //

// Function to fetch data for a specific move from the API
export const fetchMoveData = async (moveName) => {
  try {
    // Make an API request to fetch data for the chosen move
    const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName}/`);
    const data = await res.json(); // Parse the response as JSON
    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching move data:", error);
    return null; // Return null if there is an error
  }
};

// Function to fetch data for a specific ability from the API
export const fetchAbilityData = async (abilityName) => {
  try {
    // Make an API request to fetch data for the chosen ability
    const res = await fetch(
      `https://pokeapi.co/api/v2/ability/${abilityName}/`
    );
    const data = await res.json(); // Parse the response as JSON
    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching ability data:", error);
    return null; // Return null if there is an error
  }
};

// Function to handle clicking on a move in a Pokémon's modal
export function handleMoveClick(
  moveName,
  fetchMoveData,
  setSelectedMove,
  moveDetailsModalHandler
) {
  // Fetch the move data and then update the state and show the modal
  fetchMoveData(moveName).then((data) => {
    setSelectedMove(data); // Update the selected move state with the fetched data
    moveDetailsModalHandler(); // Show in the move details modal
  });
}

// Function to handle clicking on an ability in a Pokémon's modal
export function handleAbilityClick(
  abilityName,
  fetchAbilityData,
  setSelectedAbility,
  abilityDetailsModalHandler
) {
  // Fetch the ability data and then update the state and show the modal
  fetchAbilityData(abilityName).then((data) => {
    setSelectedAbility(data); // Update the selected ability state with the fetched data
    abilityDetailsModalHandler(); // Show in the ability details modal
  });
}
