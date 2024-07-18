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

export const dmgClassImageMap = {
  physical: "physical.png",
  special: "special.png",
  status: "status.png",
};

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

export const getAllPokemon = async (setAllPokemon) => {
  try {
    const res = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=649&offset=0"
    );
    const data = await res.json();
    const pokemonUrls = data.results.map((pokemon) => pokemon.url);

    const pokemonDataPromises = pokemonUrls.map(async (url) => {
      const res = await fetch(url);
      return res.json();
    });

    const pokemonData = await Promise.all(pokemonDataPromises);
    const alternateFormesPromises = Object.values(alternateFormesMapping).map(
      async (formeName) => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${formeName}`
        );
        return res.json();
      }
    );

    const alternateFormesData = await Promise.all(alternateFormesPromises);

    const mergedData = pokemonData.concat(alternateFormesData);

    mergedData.sort((a, b) => a.id - b.id);

    setAllPokemon(mergedData);
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
  }
};

export const searchPokemon = (searchTerm, allPokemon, setSearchedPokemon) => {
  const filteredPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setSearchedPokemon(filteredPokemon);
};

export const fetchBWUnovaPokedex = async () => {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/8");
    const data = await res.json();
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching BW Unova Pokedex data:", error);
    return [];
  }
};

export const fetchBW2UnovaPokedex = async () => {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/9");
    const data = await res.json();
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching BW2 Unova Pokedex data:", error);
    return [];
  }
};

export const fetchNationalPokedex = async () => {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokedex/1");
    const data = await res.json();
    return data.pokemon_entries.map((entry) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching National Pokedex data:", error);
    return [];
  }
};

export const toggleGameType = (setGameType, setPokedexType) => {
  setGameType((prevType) => {
    const newGameType = prevType === "bw" ? "bw2" : "bw";

    setPokedexType((prevPokedexType) => {
      if (newGameType === "bw") {
        return prevPokedexType === "bwRegional" ? "national" : "bwRegional";
      } else if (newGameType === "bw2") {
        return prevPokedexType === "bw2Regional" ? "national" : "bw2Regional";
      }
      return prevPokedexType;
    });

    return newGameType;
  });
};

export const togglePokedexType = (setPokedexType, pokedexType, gameType) => {
  if (gameType === "bw") {
    if (pokedexType === "bwRegional") {
      setPokedexType("national");
    } else if (pokedexType === "national") {
      setPokedexType("bwRegional");
    }
  } else if (gameType === "bw2") {
    if (pokedexType === "bw2Regional") {
      setPokedexType("national");
    } else if (pokedexType === "national") {
      setPokedexType("bw2Regional");
    }
  }
};

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
  let filteredPokemon = [];

  if (pokedexType === "bwRegional") {
    filteredPokemon = pokemonArray
      .filter((pokemonStats) => {
        const bwName =
          nationalToBWPokemonMapping[pokemonStats.name] || pokemonStats.name;
        return bwUnovaPokedex.includes(bwName);
      })
      .map((pokemonStats) => {
        const bwName =
          nationalToBWPokemonMapping[pokemonStats.name] || pokemonStats.name;
        const idInBW = bwUnovaPokedex.indexOf(bwName);
        return { ...pokemonStats, id: idInBW.toString().padStart(3, "0") };
      })
      .sort((a, b) => a.id - b.id);
  } else if (pokedexType === "national") {
    if (gameType === "bw") {
      filteredPokemon = pokemonArray
        .filter((pokemonStats) => {
          const bwName =
            nationalToBWPokemonMapping[pokemonStats.name] || pokemonStats.name;
          return nationalPokedex.includes(bwName);
        })
        .map((pokemonStats) => {
          const bwName =
            nationalToBWPokemonMapping[pokemonStats.name] || pokemonStats.name;
          const nationalId = nationalPokedex.indexOf(bwName);
          return {
            ...pokemonStats,
            id: (nationalId + 1).toString().padStart(3, "0"),
          };
        })
        .sort((a, b) => a.id - b.id);
    } else if (gameType === "bw2") {
      filteredPokemon = pokemonArray
        .filter((pokemonStats) => {
          const bw2Name =
            nationalToBW2PokemonMapping[pokemonStats.name] || pokemonStats.name;
          return nationalPokedex.includes(bw2Name);
        })
        .map((pokemonStats) => {
          const bw2Name =
            nationalToBW2PokemonMapping[pokemonStats.name] || pokemonStats.name;
          const nationalId = nationalPokedex.indexOf(bw2Name);
          return {
            ...pokemonStats,
            id: (nationalId + 1).toString().padStart(3, "0"),
          };
        })
        .sort((a, b) => a.id - b.id);
    }
  } else if (pokedexType === "bw2Regional") {
    filteredPokemon = pokemonArray
      .filter((pokemonStats) => {
        const bw2Name =
          nationalToBW2PokemonMapping[pokemonStats.name] || pokemonStats.name;
        return bw2UnovaPokedex.includes(bw2Name);
      })
      .map((pokemonStats) => {
        const bw2Name =
          nationalToBW2PokemonMapping[pokemonStats.name] || pokemonStats.name;
        const idInBW2 = bw2UnovaPokedex.indexOf(bw2Name);
        return { ...pokemonStats, id: idInBW2.toString().padStart(3, "0") };
      })
      .sort((a, b) => a.id - b.id);
  }

  return filteredPokemon;
};

export const teamItem = {
  pokemon: null,
  isShiny: false,
};

export const addToTeam = (pokemon, team, setTeam) => {
  if (team.length < 6 && !team.find((item) => item.pokemon === pokemon)) {
    setTeam([...team, { ...teamItem, pokemon }]);
  }
};

export const removeFromTeam = (pokemon, team, setTeam) => {
  const updatedTeam = team.filter((item) => item.pokemon !== pokemon);
  setTeam(updatedTeam);
};

export const toggleShiny = (pokemon, team, setTeam) => {
  const updatedTeam = team.map((item) => {
    if (item.pokemon === pokemon) {
      return { ...item, isShiny: !item.isShiny };
    }
    return item;
  });
  setTeam(updatedTeam);
};

export const getMoveSets = (pokemonMoves) => {
  return pokemonMoves.map((move) => move.move.name);
};

export const getAbilities = (pokemonAbilities) => {
  return pokemonAbilities.map((ability) => ability.ability.name);
};

export const getPokemonTypes = (pokemonStats) => {
  const isRotom = pokemonStats.name.startsWith("rotom-");

  if (isRotom) {
    return (pokemonStats.types || []).map((type) => type.type.name).join(", ");
  }

  const hasPastTypes =
    pokemonStats.past_types &&
    Array.isArray(pokemonStats.past_types) &&
    pokemonStats.past_types.length > 0;

  if (hasPastTypes) {
    return pokemonStats.past_types
      .map((pastType) =>
        pastType.types.map((type) => type.type.name).join(", ")
      )
      .join(", ");
  } else {
    return (pokemonStats.types || []).map((type) => type.type.name).join(", ");
  }
};

export const getPokemonTypeImages = (pokemonStats) => {
  const isRotom = pokemonStats.name.startsWith("rotom-");

  if (isRotom) {
    return (pokemonStats.types || []).map((type) => ({
      image: getTypeImage(type.type.name),
    }));
  }

  const hasPastTypes =
    pokemonStats.past_types &&
    Array.isArray(pokemonStats.past_types) &&
    pokemonStats.past_types.length > 0;

  if (hasPastTypes) {
    return pokemonStats.past_types.map((pastType) => ({
      image: getTypeImage(
        pastType.types.map((type) => type.type.name).join(", ")
      ),
    }));
  } else {
    return (pokemonStats.types || []).map((type) => ({
      image: getTypeImage(type.type.name),
    }));
  }
};

export const getAllNatures = async (setAllNatures) => {
  try {
    const res = await fetch(
      "https://pokeapi.co/api/v2/nature?limit=25&offset=0"
    );
    const data = await res.json();
    const natureUrls = data.results.map((nature) => nature.url);

    const natureDataPromises = natureUrls.map(async (url) => {
      const res = await fetch(url);
      return res.json();
    });

    const natureData = await Promise.all(natureDataPromises);
    natureData.sort((a, b) => a.id - b.id);

    setAllNatures(natureData);
  } catch (error) {
    console.error("Error fetching nature data:", error);
  }
};

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

export const capitaliseEachWord = (str) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
};

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

export const playHoverSound = () => {
  const audio = new Audio(hoverSound);
  audio.play().catch((error) => {
    console.error("Error playing audio:", error.message);
  }); /*play failed no user interaction error to fix yet*/
};

//      !!!TEAMBUILDER!!!     //

export const captureTeamBuilder = () => {
  const teamBuilderContainer = document.getElementById("capture");

  teamBuilderContainer.style.backgroundImage =
    "url('src/images/BW2BACKGROUND.png')";

  if (teamBuilderContainer) {
    html2canvas(teamBuilderContainer, {
      allowTaint: true,
      useCORS: true,
    }).then((canvas) => {
      const imageDataUrl = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = imageDataUrl;
      downloadLink.download = "team_builder_capture.png";

      downloadLink.click();
    });
  }
};

export const toggleDropdown = (
  index,
  isDropdownVisible,
  setDropdownVisible
) => {
  const updatedDropdowns = [...isDropdownVisible];
  updatedDropdowns[index] = !updatedDropdowns[index];
  setDropdownVisible(updatedDropdowns);
};

export const handlePokeballSelection = (
  pokemonName,
  pokeballType,
  setSelectedPokeballs
) => {
  setSelectedPokeballs((prevSelected) => ({
    ...prevSelected,
    [pokemonName]: pokeballType,
  }));
};

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

export const openModal = (pokemon, setSelectedPokemon, setModalIsOpen) => {
  /*console.log("openModal called with:", pokemon);*/
  setSelectedPokemon(pokemon);
  setModalIsOpen(true);
};

export const handleMoveSelection = (
  pokemon,
  selectedMove,
  dropdownIndex,
  selectedMoves,
  setSelectedMoves
) => {
  const updatedSelectedMoves = { ...selectedMoves };

  if (!updatedSelectedMoves[pokemon.name]) {
    updatedSelectedMoves[pokemon.name] = {};
  }

  updatedSelectedMoves[pokemon.name][dropdownIndex] = selectedMove;

  setSelectedMoves(updatedSelectedMoves);
};

export const handleNameChange = (
  pokemon,
  currentEditedNames,
  newName,
  setEditedNames
) => {
  setEditedNames((prevNames) => ({
    ...prevNames,
    [pokemon.name]: newName,
  }));
};

export const getAffectedStats = (natureName, allNatures) => {
  if (!natureName) {
    return { increasedStat: "", decreasedStat: "", noStatChanges: true };
  }

  const nature = allNatures.find((n) => n.name === natureName);
  if (!nature) {
    return { increasedStat: "", decreasedStat: "", noStatChanges: true };
  }

  const increasedStat =
    nature.increased_stat && nature.increased_stat.name
      ? `+${nature.increased_stat.name}`
      : "";
  const decreasedStat =
    nature.decreased_stat && nature.decreased_stat.name
      ? ` -${nature.decreased_stat.name}`
      : "";

  return {
    increasedStat,
    decreasedStat,
    noStatChanges: !increasedStat && !decreasedStat,
  };
};

//      !!!MODAL!!!     //

export const fetchMoveData = async (moveName) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName}/`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching move data:", error);
    return null;
  }
};

export const fetchAbilityData = async (abilityName) => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/ability/${abilityName}/`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching ability data:", error);
    return null;
  }
};

export function handleMoveClick(
  moveName,
  fetchMoveData,
  setSelectedMove,
  moveDetailsModalHandler
) {
  fetchMoveData(moveName).then((data) => {
    setSelectedMove(data);
    moveDetailsModalHandler();
  });
}

export function handleAbilityClick(
  abilityName,
  fetchAbilityData,
  setSelectedAbility,
  abilityDetailsModalHandler
) {
  fetchAbilityData(abilityName).then((data) => {
    setSelectedAbility(data);
    abilityDetailsModalHandler();
  });
}

//      !!!ABOUT-MODAL!!!     //
