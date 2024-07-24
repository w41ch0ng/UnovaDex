import { useState, useEffect } from "react";
import "./styles.css";
import PokemonCard from "./PokemonCard";
import TeamBuilder from "./TeamBuilder";
import AboutModal from "./AboutModal";
import React, { createContext } from "react";
import SearchBar from "./SearchBar";
import pokeball from "../images/pokeballs/Poke_Ball.png";
import reshiram from "../images/logos/643.gif";
import whitekyurem from "../images/logos/646white.gif";
import bwIcon from "../images/sprites/pokedex/pokemonbwdsnew.png";
import bw2Icon from "../images/sprites/pokedex/pokemonbwds2new.png";
import nationalDex from "../images/sprites/pokedex/purpledex.png";
import pokedex from "../images/sprites/pokedex/pokedex.png";
import LoadingSpinner from "./LoadingSpinner";
import {
  typeImageMap,
  getTypeImage,
  dmgClassImageMap,
  getDmgClassImage,
  getAllPokemon,
  searchPokemon,
  fetchBWUnovaPokedex,
  fetchBW2UnovaPokedex,
  fetchNationalPokedex,
  toggleGameType,
  togglePokedexType,
  nationalToBWPokemonMapping,
  nationalToBW2PokemonMapping,
  filterPokemonByPokedexType,
  teamItem,
  addToTeam,
  removeFromTeam,
  toggleShiny,
  getMoveSets,
  getAbilities,
  getPokemonTypes,
  getPokemonTypeImages,
  getAllNatures,
  alternateFormesMapping,
  capitaliseEachWord,
  getPokedexTypeNumber,
  captureTeamBuilder,
  aboutModalHandler,
  closeAboutModalHandler,
} from "./utils";

export const TypeImageContext = createContext();
export const DmgClassImageContext = createContext();
export const CapitaliseEachWordContext = createContext();

function PokeList() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [allNatures, setAllNatures] = useState([]);
  const [searchedPokemon, setSearchedPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pokedexType, setPokedexType] = useState("bwRegional");
  const [shinyToggle, setShinyToggle] = useState("default");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [team, setTeam] = useState([]);
  const [moveSets, setMoveSets] = useState([]);
  const [bwUnovaPokedex, setBWUnovaPokedex] = useState([]);
  const [bw2UnovaPokedex, setBW2UnovaPokedex] = useState([]);
  const [nationalPokedex, setNationalPokedex] = useState([]);
  const [gameType, setGameType] = useState("bw");
  const [aboutModalIsOpen, setAboutModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* useEffect where fetchData is declared to initialise the getters and setters 
  for the application */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getAllPokemon(setAllPokemon);
      await getAllNatures(setAllNatures);
      const bwUnovaData = await fetchBWUnovaPokedex();
      setBWUnovaPokedex(bwUnovaData);
      const bw2UnovaData = await fetchBW2UnovaPokedex();
      setBW2UnovaPokedex(bw2UnovaData);
      const nationalData = await fetchNationalPokedex();
      setNationalPokedex(nationalData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Function to open the About modal
  function aboutModalHandler() {
    setAboutModalIsOpen(true);
  }

  // Function to close the About modal
  function closeAboutModalHandler() {
    setAboutModalIsOpen(false);
  }

  return (
    <TypeImageContext.Provider value={{ getTypeImage }}>
      <DmgClassImageContext.Provider value={{ getDmgClassImage }}>
        <CapitaliseEachWordContext.Provider value={{ capitaliseEachWord }}>
          <div className="header">
            <div className="wrapper">
              <div className="title">
                <img src={reshiram} alt="reshiram" className="reshiram" />
                <p>UnovaDex</p>
                <img
                  src={whitekyurem}
                  alt="white kyurem"
                  className="whitekyurem"
                />
              </div>
              <div className="caught">
                <img src={pokeball} alt="pokeballcolor" className="pokeball" />
                <p>{getPokedexTypeNumber(pokedexType)}</p>
              </div>
            </div>
          </div>
          <div className="wrapper">
            <div className="content">
              <TeamBuilder
                team={team}
                setTeam={setTeam}
                shinyToggle={shinyToggle}
                removeFromTeam={removeFromTeam}
                toggleShiny={toggleShiny}
                addToTeam={addToTeam}
                moveSets={moveSets}
                getMoveSets={getMoveSets}
                getAbilities={getAbilities}
                allNatures={allNatures}
                getPokemonTypes={getPokemonTypes}
                getPokemonTypeImages={getPokemonTypeImages}
              />
              <div className="pokedex-container">
                <div className="search-tools-container">
                  <div className="search-container">
                    <SearchBar
                      onSearch={(term) =>
                        searchPokemon(term, allPokemon, setSearchedPokemon)
                      }
                      allPokemon={allPokemon}
                    />
                  </div>
                  <div className="toggles">
                    <div className="game-type-toggle">
                      <img
                        className="game-type-toggle-image"
                        src={gameType === "bw" ? bwIcon : bw2Icon}
                        alt="Game Type Toggle"
                        onClick={() =>
                          toggleGameType(setGameType, setPokedexType)
                        }
                      />
                    </div>
                    <div className="pokedex-toggle">
                      <img
                        className="pokedex-type-toggle-image"
                        src={
                          pokedexType === "bwRegional" ||
                          pokedexType === "bw2Regional"
                            ? pokedex
                            : nationalDex
                        }
                        alt="Game Type Toggle"
                        onClick={() =>
                          togglePokedexType(
                            setPokedexType,
                            pokedexType,
                            gameType
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="all-pokemon-container">
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    filterPokemonByPokedexType(
                      searchedPokemon.length > 0 ? searchedPokemon : allPokemon,
                      pokedexType,
                      gameType,
                      bwUnovaPokedex,
                      bw2UnovaPokedex,
                      nationalPokedex
                    ).map((pokemonStats) => (
                      <PokemonCard
                        key={pokemonStats.name}
                        id={pokemonStats.id.toString().padStart(3, "0")}
                        icon={
                          pokemonStats.sprites.versions["generation-viii"].icons
                            .front_default
                        }
                        homeImage={
                          pokemonStats.sprites.other.home.front_default
                        }
                        animatedImage={
                          pokemonStats.sprites.versions["generation-v"][
                            "black-white"
                          ].animated.front_default
                        }
                        animatedImageBack={
                          pokemonStats.sprites.versions["generation-v"][
                            "black-white"
                          ].animated.back_default
                        }
                        shinyAnimatedImage={
                          pokemonStats.sprites.versions["generation-v"][
                            "black-white"
                          ].animated.front_shiny
                        }
                        shinyAnimatedImageBack={
                          pokemonStats.sprites.versions["generation-v"][
                            "black-white"
                          ].animated.back_shiny
                        }
                        name={pokemonStats.name.replace(/^./, (str) =>
                          str.toUpperCase()
                        )}
                        isLegendary={pokemonStats.is_legendary}
                        type={getPokemonTypes(pokemonStats)}
                        typeImages={getPokemonTypeImages(pokemonStats)}
                        typeImagesClassName="type-image-container"
                        weight={pokemonStats.weight}
                        height={pokemonStats.height}
                        stats={pokemonStats.stats
                          .map((stat) => stat.base_stat)
                          .slice(0, 6)}
                        statsName={pokemonStats.stats
                          .map((stat, index) =>
                            index === 0
                              ? stat.stat.name.toUpperCase()
                              : stat.stat.name
                          )
                          .slice(0, 6)}
                        moves={pokemonStats.moves.map((move) => move.move.name)}
                        abilities={pokemonStats.abilities.map(
                          (ability) => ability.ability.name
                        )}
                        forms={pokemonStats.forms.map((form) => form.name)}
                        onAddToTeam={() =>
                          addToTeam(pokemonStats, team, setTeam)
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div
              className="bottom-btn about-modal-open"
              onClick={aboutModalHandler}
            >
              <p className="bg-circle-white">A</p>
              <p>About/Credits/GitHub</p>
            </div>
            <div className="bottom-btn" onClick={captureTeamBuilder}>
              <p className="bg-circle-white">Y</p>
              <p>Export Team</p>
            </div>
          </div>
          {aboutModalIsOpen && (
            <AboutModal closeAboutModalHandler={closeAboutModalHandler} />
          )}
        </CapitaliseEachWordContext.Provider>
      </DmgClassImageContext.Provider>
    </TypeImageContext.Provider>
  );
}
export default PokeList;
