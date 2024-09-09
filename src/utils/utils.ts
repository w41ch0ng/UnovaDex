import html2canvas from "html2canvas";
import {
  AbilityData,
  NatureData,
  PokemonStats,
  TeamItem,
  PokedexResponse,
  MoveData,
  TypeImage,
} from "./interfaces";
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
import waterImg from "../images/typeimages/water.png";
import fireImg from "../images/typeimages/fire.png";
import grassImg from "../images/typeimages/grass.png";
import bugImg from "../images/typeimages/bug.png";
import darkImg from "../images/typeimages/dark.png";
import dragonImg from "../images/typeimages/dragon.png";
import electricImg from "../images/typeimages/electric.png";
import fairyImg from "../images/typeimages/fairy.png";
import fightingImg from "../images/typeimages/fighting.png";
import flyingImg from "../images/typeimages/flying.png";
import ghostImg from "../images/typeimages/ghost.png";
import groundImg from "../images/typeimages/ground.png";
import iceImg from "../images/typeimages/ice.png";
import normalImg from "../images/typeimages/normal.png";
import poisonImg from "../images/typeimages/poison.png";
import psychicImg from "../images/typeimages/psychic.png";
import rockImg from "../images/typeimages/rock.png";
import steelImg from "../images/typeimages/steel.png";
import physicalImg from "../images/dmgclassimages/physical.png";
import specialImg from "../images/dmgclassimages/special.png";
import statusImg from "../images/dmgclassimages/status.png";
import {
  GameType,
  PokeballType,
  PokedexType,
  PokemonType,
  DamageType,
} from "./types";

//   !!!APP!!!   //

// Define the type image map using TS Record (object type where PokemonType is set
// of keys, string is type of values - key-value pair)
export const typeImageMap: Record<PokemonType, string> = {
  water: waterImg,
  fire: fireImg,
  grass: grassImg,
  bug: bugImg,
  dark: darkImg,
  dragon: dragonImg,
  electric: electricImg,
  fairy: fairyImg,
  fighting: fightingImg,
  flying: flyingImg,
  ghost: ghostImg,
  ground: groundImg,
  ice: iceImg,
  normal: normalImg,
  poison: poisonImg,
  psychic: psychicImg,
  rock: rockImg,
  steel: steelImg,
};

// Function to get the type image based on the type name
export const getTypeImage = (typeName: string): string | undefined => {
  const type = typeName.toLowerCase() as PokemonType;
  return typeImageMap[type] || undefined;
};

// Define damage class images map using TS Record (object type where DamageType is set
// of keys, string is type of values)
export const dmgClassImageMap: Record<DamageType, string> = {
  physical: physicalImg,
  special: specialImg,
  status: statusImg,
};

// Function to get the damage class image based on the damage class name
export const getDmgClassImage = (damageClass: string): string | undefined => {
  const type = damageClass.toLowerCase() as DamageType;
  return dmgClassImageMap[type] || undefined;
};

// Function to fetch data with retry logic
const fetchWithRetry = async (
  url: string,
  retries: number = 3,
  delay: number = 1000
) => {
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
        throw new Error(
          `Invalid JSON response for URL: ${url}, body: ${text}, error: ${jsonError}`
        );
      }

      // Return the parsed JSON data
      return data;
    } catch (error) {
      // Check if error is instance of Error to access 'message' safely
      if (error instanceof Error) {
        console.error(`Fetch error for ${url}: ${error.message}`);
      } else {
        console.error(`Unknown error occurred while fetching ${url}`);
      }
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
export const getAllPokemon = async (
  setAllPokemon: React.Dispatch<React.SetStateAction<PokemonStats[]>>
) => {
  try {
    // Fetch the main Pokémon list with the fetch with retry function
    const res = await fetchWithRetry(
      "https://pokeapi.co/api/v2/pokemon?limit=649&offset=0"
    );
    console.log("Fetched main Pokémon list:", res);

    // Extract the URLs of individual Pokémon from the main list
    const pokemonUrls = res.results.map(
      (pokemon: { url: string }) => pokemon.url
    );

    // Create an array of promises to fetch data for each individual Pokémon
    const pokemonDataPromises = pokemonUrls.map((url: string) =>
      fetchWithRetry(url)
    );

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
export const searchPokemon = (
  searchTerm: string,
  allPokemon: PokemonStats[],
  setSearchedPokemon: React.Dispatch<React.SetStateAction<PokemonStats[]>>
) => {
  /* Filter the Pokémon list by checking if their name includes the
  search term (case insensitive) */
  const filteredPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Update the state with the filtered list of Pokémon
  setSearchedPokemon(filteredPokemon);
};

// Function to fetch the Black and White (BW) Unova Pokédex data
export const fetchBWUnovaPokedex = async (): Promise<string[]> => {
  try {
    // Fetch data from the BW Pokédex endpoint
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/8");
    const data: PokedexResponse = await res.json(); // Use the PokedexResponse type
    // Extract and return the names of the Pokémon species from the data
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching BW Unova Pokedex data:", error);
    return []; // Return an empty array in case of error
  }
};

// Function to fetch the Black and White 2 (BW2) Unova Pokédex data
export const fetchBW2UnovaPokedex = async (): Promise<string[]> => {
  try {
    // Fetch data from the BW2 Pokédex endpoint
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/9");
    const data: PokedexResponse = await res.json(); // Use the PokedexResponse type
    // Extract and return the names of the Pokémon species from the data
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching BW2 Unova Pokedex data:", error);
    return []; // Return an empty array in case of error
  }
};

// Function to fetch the National Pokédex data
export const fetchNationalPokedex = async (): Promise<string[]> => {
  try {
    // Fetch data from the National Pokédex endpoint
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/1");
    const data: PokedexResponse = await res.json(); // Use the PokedexResponse type
    // Extract and return the names of the Pokémon species from the data
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching National Pokedex data:", error);
    return []; // Return an empty array in case of error
  }
};

// Function to toggle between game types and update the Pokédex type accordingly
export const toggleGameType = (
  setGameType: React.Dispatch<React.SetStateAction<GameType>>,
  setPokedexType: React.Dispatch<React.SetStateAction<PokedexType>>
) => {
  // Update the game type state
  setGameType((prevType: GameType) => {
    // Determine the new game type based on the previous game type
    const newGameType: GameType = prevType === "bw" ? "bw2" : "bw";

    // Update the Pokédex type state based on the new game type
    setPokedexType((prevPokedexType: PokedexType) => {
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
export const togglePokedexType = (
  setPokedexType: React.Dispatch<React.SetStateAction<PokedexType>>,
  pokedexType: PokedexType,
  gameType: GameType
) => {
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
const nationalToBWPokemonMapping: { [key: string]: string } = {
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
export const nationalToBW2PokemonMapping: { [key: string]: string } = {
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

// Function to filter Pokémon based on current dex type
export const filterPokemonByPokedexType = (
  pokemonArray: PokemonStats[],
  pokedexType: PokedexType,
  gameType: GameType,
  bwUnovaPokedex: string[],
  bw2UnovaPokedex: string[],
  nationalPokedex: string[]
) => {
  let filteredPokemon: PokemonStats[] = []; // Initialise an empty array for filtered Pokémon

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
        return {
          ...pokemonStats,
          id: Number(idInBW.toString().padStart(3, "0")),
        };
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
            id: Number((nationalId + 1).toString().padStart(3, "0")),
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
            id: Number((nationalId + 1).toString().padStart(3, "0")),
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
        return {
          ...pokemonStats,
          id: Number(idInBW2.toString().padStart(3, "0")),
        };
      })
      .sort((a, b) => a.id - b.id); // Sort by ID
  }

  return filteredPokemon; // Return the filtered and sorted Pokémon array
};

// Function to get the move sets of a Pokémon
export const getMoveSets = (
  pokemonMoves: { move: { name: string } }[]
): string[] => {
  return pokemonMoves.map((move) => move.move.name); // Map each move to its name
};

// Function to get the abilities of a Pokémon
export const getAbilities = (
  pokemonAbilities: { ability: { name: string } }[]
): string[] => {
  // Map each ability to its name
  return pokemonAbilities.map((ability) => ability.ability.name);
};

// Function to get the types of a Pokémon
export const getPokemonTypes = (pokemonStats: PokemonStats): string[] => {
  /* Check if Pokémon is a form of Rotom. A separate function is written for
  Rotom specifically as its multiple formes with different types was causing
  issues when fetching all formes */
  const isRotom = pokemonStats.name.startsWith("rotom-");

  // If Pokémon is Rotom, return the names of its current types
  if (isRotom) {
    return (pokemonStats.types || []).map((type) => type.type.name);
  }

  // Check if Pokémon has past types
  const hasPastTypes =
    pokemonStats.past_types &&
    Array.isArray(pokemonStats.past_types) &&
    pokemonStats.past_types.length > 0;

  // If it has past types, return all past type names
  if (hasPastTypes) {
    return pokemonStats.past_types.flatMap((pastType) =>
      pastType.types.map((type) => type.type.name)
    );
  } else {
    // Otherwise, return current type names
    return (pokemonStats.types || []).map((type) => type.type.name);
  }
};

// Function to get the type images for a Pokémon
export const getPokemonTypeImages = (
  pokemonStats: PokemonStats
): TypeImage[] => {
  // Check if Pokémon is a form of Rotom.
  const isRotom = pokemonStats.name.startsWith("rotom-");

  // If Pokémon is Rotom, return its type images with the name
  if (isRotom) {
    return (pokemonStats.types || []).map((type) => ({
      name: type.type.name,
      image: getTypeImage(type.type.name) || "",
    }));
  }

  // Check if Pokémon has past types
  const hasPastTypes =
    pokemonStats.past_types &&
    Array.isArray(pokemonStats.past_types) &&
    pokemonStats.past_types.length > 0;

  // If Pokémon has past types, return their images and names
  if (hasPastTypes) {
    return pokemonStats.past_types.flatMap((pastType) =>
      pastType.types.map((type) => ({
        name: type.type.name,
        image: getTypeImage(type.type.name) || "",
      }))
    );
  } else {
    // If no past types, return the current type images and names
    return (pokemonStats.types || []).map((type) => ({
      name: type.type.name,
      image: getTypeImage(type.type.name) || "", // Provide fallback for undefined
    }));
  }
};

// Function to fetch all natures and update the allNatures state
export const getAllNatures = async (
  setAllNatures: React.Dispatch<React.SetStateAction<NatureData[]>>
) => {
  try {
    const res = await fetch(
      "https://pokeapi.co/api/v2/nature?limit=25&offset=0"
    ); // Fetch nature data from nature API endpoint
    const data = await res.json(); // Parse the response as JSON
    // Get URLs for each nature
    const natureUrls = data.results.map((nature: NatureData) => nature.url);

    const natureDataPromises = natureUrls.map(async (url: string) => {
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
export const capitaliseEachWord = (str: string) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
};

// Function to update the total number of Pokémon value based on the Pokédex type
export const getPokedexTypeNumber = (pokedexType: PokedexType) => {
  if (pokedexType === "bwRegional") {
    return "156";
  } else if (pokedexType === "bw2Regional") {
    return "301";
  } else if (pokedexType === "national") {
    return "649";
  }
};

//   !!!POKELIST!!!   //

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
export const addToTeam = (
  pokemon: PokemonStats,
  team: TeamItem[],
  setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>
) => {
  // If the team has less than 6 Pokémon, get the Pokémon, add it, and update team state
  if (team.length < 6 && !team.find((item) => item.pokemon === pokemon)) {
    setTeam([...team, { ...teamItem, pokemon }]);
  }
};

// Function to remove a Pokémon from the team builder
export const removeFromTeam = (
  pokemon: PokemonStats,
  team: TeamItem[],
  setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>
) => {
  // Filter the team array to exclude the selected Pokémon
  const updatedTeam = team.filter((item) => item.pokemon !== pokemon);
  // Update the team state with the filtered array
  setTeam(updatedTeam);
};

// Function to toggle the shiny status of a Pokémon in the team
export const toggleShiny = (
  pokemon: PokemonStats,
  team: TeamItem[],
  setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>
) => {
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

  if (teamBuilderContainer) {
    // Set the background image of the team builder container
    teamBuilderContainer.style.backgroundImage =
      "url('src/images/BW2BACKGROUND.png')";

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
  index: number, // The index of the dropdown
  isDropdownVisible: boolean[], // Array representing visibility state for each dropdown
  setDropdownVisible: (visibility: boolean[]) => void
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
  pokemonName: string,
  pokeballType: PokeballType,
  setSelectedPokeballs: React.Dispatch<
    React.SetStateAction<Record<string, PokeballType>>
  >
) => {
  // Update the selected Pokéballs state with the new selection
  setSelectedPokeballs((prevSelected) => ({
    ...prevSelected, // Spread the previous selections
    [pokemonName]: pokeballType, // Add/update the selection for the selected Pokémon
  }));
};

// Pokéball types images map
export const pokeballTypes: { type: PokeballType; image: string }[] = [
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
export const getSelectedPokeballImage = (pokeballType: PokeballType) => {
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
export const openModal = (
  pokemon: PokemonStats,
  setSelectedPokemon: React.Dispatch<React.SetStateAction<PokemonStats | null>>,
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setSelectedPokemon(pokemon); // Set selectedPokemon state to selected Pokémon
  setModalIsOpen(true); // Set modalIsOpen state to true
};

// Function to handle the selection of a move for a Pokémon
export const handleMoveSelection = (
  pokemon: PokemonStats,
  selectedMove: string,
  dropdownIndex: number,
  selectedMoves: Record<string, Record<number, string>>,
  setSelectedMoves: React.Dispatch<
    React.SetStateAction<Record<string, Record<number, string>>>
  >
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
  pokemon: PokemonStats,
  newName: string,
  setEditedNames: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  // Update the state with the new name for the specified Pokémon
  setEditedNames((prevNames) => ({
    ...prevNames, // Spread the previous names to maintain existing entries
    [pokemon.name]: newName, // Set the new name for the specified Pokémon
  }));
};

// Function to get the stats affected by a chosen nature
export const getAffectedStats = (
  natureName: string | null,
  allNatures: NatureData[]
) => {
  // If no nature name is specified, return default values indicating no stat changes
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
export const fetchMoveData = async (moveName: string) => {
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
export const fetchAbilityData = async (abilityName: string) => {
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
  moveName: string,
  fetchMoveData: (moveName: string) => Promise<MoveData | null>,
  setSelectedMove: React.Dispatch<React.SetStateAction<MoveData | null>>
) {
  // Fetch the move data and then update the state and show the modal
  fetchMoveData(moveName).then((data: MoveData | null) => {
    if (data) setSelectedMove(data); // Update the selected move state with the fetched data
  });
}

// Function to handle clicking on an ability in a Pokémon's modal
export function handleAbilityClick(
  abilityName: string,
  fetchAbilityData: (abilityName: string) => Promise<AbilityData | null>,
  setSelectedAbility: React.Dispatch<React.SetStateAction<AbilityData | null>>
) {
  // Fetch the ability data and then update the state and show the modal
  fetchAbilityData(abilityName).then((data: AbilityData | null) => {
    if (data) setSelectedAbility(data); // Update the selected ability state with the fetched data
  });
}
