import React, { useState, useRef, useContext } from "react";
import html2canvas from "html2canvas";
import Modal from "./Modal";
import "./styles.css";
import { CapitaliseEachWordContext } from "./PokeList";
import {
  typeImageMap,
  getTypeImage,
  dmgClassImageMap,
  getDmgClassImage,
  teamItem,
  addToTeam,
  removeFromTeam,
  toggleShiny,
  getMoveSets,
  getAbilities,
  getPokemonTypes,
  getPokemonTypeImages,
  getAllNatures,
  captureTeamBuilder,
  handlePokeballSelection,
  toggleDropdown,
  pokeballTypes,
  getSelectedPokeballImage,
  openModal,
  handleMoveSelection,
  handleNameChange,
  getAffectedStats,
} from "./utils";
import xButton from "../images/sprites/redxbutton.png";
import shinyCharm from "../images/sprites/shinycharm.png";
import shinyCharmInverted from "../images/sprites/shinycharminverted.png";
//import background from "../images/modalbackground.png";
import teamslotbw2 from "../images/slots/team slot bw2.png";
import question from "../images/sprites/question mark GIF.gif";

function TeamBuilder({
  team,
  setTeam,
  removeFromTeam,
  toggleShiny,
  addToTeam,
  moveSets,
  getMoveSets,
  getAbilities,
  allNatures,
  getPokemonTypes,
  getPokemonTypeImages,
}) {
  const { capitaliseEachWord } = useContext(CapitaliseEachWordContext);

  const [isDropdownVisible, setDropdownVisible] = useState(
    Array(6).fill(false)
  );

  const [selectedMoves, setSelectedMoves] = useState({});
  const [editedNames, setEditedNames] = useState({});
  const [selectedNatures, setSelectedNatures] = useState({});
  const [selectedPokeballs, setSelectedPokeballs] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const dropdownRef = useRef(null);

  return (
    <div className="team-builder-container" id="capture">
      {[...Array(6).keys()].map((index) => {
        const teamItem = team[index] || { pokemon: null, isShiny: false };

        const affectedStats = getAffectedStats(
          selectedNatures[teamItem.pokemon?.name] || null,
          allNatures
        );

        return (
          <div key={index} className="team-slot">
            <img src={teamslotbw2} className="team-slot-bw2" />
            <div className="team-slot-container">
              {teamItem.pokemon ? (
                <>
                  <div className="topbar-container">
                    <div
                      className="pokeball-dropdown"
                      onClick={() =>
                        toggleDropdown(
                          index,
                          isDropdownVisible,
                          setDropdownVisible
                        )
                      }
                    >
                      <div className="pokeball-dropdown-wrapper">
                        <img
                          src={getSelectedPokeballImage(
                            selectedPokeballs[teamItem.pokemon.name] ||
                              pokeballTypes[0].type
                          )}
                          alt="Selected Pokeball"
                          className="selected-pokeball"
                        />
                      </div>
                      <div
                        ref={dropdownRef}
                        className={`list ${
                          isDropdownVisible[index] ? "show" : ""
                        }`}
                      >
                        {pokeballTypes.map((ball) => (
                          <div
                            key={ball.type}
                            className="item"
                            onClick={() =>
                              handlePokeballSelection(
                                teamItem.pokemon.name,
                                ball.type,
                                setSelectedPokeballs
                              )
                            }
                          >
                            <img src={ball.image} alt={ball.type} />
                          </div>
                        ))}
                      </div>{" "}
                    </div>
                    <input
                      className="team-slot-name"
                      type="text"
                      value={
                        editedNames[teamItem.pokemon.name] !== undefined
                          ? editedNames[teamItem.pokemon.name]
                          : capitaliseEachWord(teamItem.pokemon.name)
                      }
                      onChange={(e) =>
                        handleNameChange(
                          teamItem.pokemon,
                          editedNames,
                          e.target.value,
                          setEditedNames
                        )
                      }
                      maxLength={11}
                    ></input>
                    <img
                      src={teamItem.isShiny ? shinyCharmInverted : shinyCharm}
                      alt="Shiny Icon"
                      className="shiny-icon"
                      onClick={() =>
                        toggleShiny(teamItem.pokemon, team, setTeam)
                      }
                    />
                    <img
                      src={xButton}
                      className="remove-from-team"
                      onClick={() =>
                        removeFromTeam(teamItem.pokemon, team, setTeam)
                      }
                    />
                  </div>
                  <div className="team-slot-image-container">
                    <img
                      src={
                        teamItem.isShiny
                          ? teamItem.pokemon.sprites.versions["generation-v"][
                              "black-white"
                            ].animated.front_shiny
                          : teamItem.pokemon.sprites.versions["generation-v"][
                              "black-white"
                            ].animated.front_default
                      }
                      alt={teamItem.pokemon.name}
                      className="team-pokemon-sprite"
                      onClick={() =>
                        openModal(
                          teamItem.pokemon,
                          setSelectedPokemon,
                          setModalIsOpen
                        )
                      }
                    />{" "}
                  </div>
                  {selectedNatures[teamItem.pokemon.name] && (
                    <div className="nature-stats">
                      {affectedStats.noStatChanges ? (
                        <div className="no-stat-changes">No stat changes</div>
                      ) : (
                        <>
                          <div className="stat-increase">{`${affectedStats.increasedStat}`}</div>
                          <div className="stat-reduction">{`${affectedStats.decreasedStat}`}</div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="team-slot-all-dropdowns">
                    <div className="team-slot-dropdowns">
                      {Array.from({ length: 2 }, (_, i) => (
                        <select
                          className="team-slot-move-dropdowns"
                          key={i}
                          value={
                            selectedMoves[teamItem.pokemon.name]?.[i] || ""
                          }
                          onChange={(e) =>
                            handleMoveSelection(
                              teamItem.pokemon,
                              e.target.value,
                              i,
                              selectedMoves,
                              setSelectedMoves
                            )
                          }
                        >
                          <option
                            className="team-slot-dropdown-options"
                            value=""
                          >
                            Move
                          </option>
                          {getMoveSets(teamItem.pokemon.moves || [])
                            .filter(
                              (move) =>
                                !Object.values(
                                  selectedMoves[teamItem.pokemon.name] || {}
                                ).includes(move) ||
                                move ===
                                  selectedMoves[teamItem.pokemon.name]?.[i]
                            )
                            .map((move) => (
                              <option
                                className="team-slot-dropdown-options"
                                key={move}
                                value={move}
                              >
                                {capitaliseEachWord(move)}
                              </option>
                            ))}
                        </select>
                      ))}
                    </div>
                    <div className="team-slot-dropdowns">
                      {Array.from({ length: 2 }, (_, i) => (
                        <select
                          className="team-slot-move-dropdowns"
                          key={i + 2}
                          value={
                            selectedMoves[teamItem.pokemon.name]?.[i + 2] || ""
                          }
                          onChange={(e) =>
                            handleMoveSelection(
                              teamItem.pokemon,
                              e.target.value,
                              i + 2,
                              selectedMoves,
                              setSelectedMoves
                            )
                          }
                        >
                          <option
                            className="team-slot-dropdown-options"
                            value=""
                          >
                            Move
                          </option>
                          {getMoveSets(teamItem.pokemon.moves || [])
                            .filter(
                              (move) =>
                                !Object.values(
                                  selectedMoves[teamItem.pokemon.name] || {}
                                ).includes(move) ||
                                move ===
                                  selectedMoves[teamItem.pokemon.name]?.[i + 2]
                            )
                            .map((move) => (
                              <option
                                className="team-slot-dropdown-options"
                                key={move}
                                value={move}
                              >
                                {capitaliseEachWord(move)}
                              </option>
                            ))}
                        </select>
                      ))}
                    </div>
                    <div className="team-slot-dropdowns">
                      <select className="team-slot-ability-dropdown">
                        <option className="team-slot-dropdown-options" value="">
                          Ability
                        </option>
                        {getAbilities(teamItem.pokemon.abilities || []).map(
                          (ability) => (
                            <option
                              className="team-slot-dropdown-options"
                              key={ability}
                              value={ability}
                            >
                              {capitaliseEachWord(ability)}
                            </option>
                          )
                        )}
                      </select>
                      <select
                        className="team-slot-nature-dropdown"
                        value={selectedNatures[teamItem.pokemon.name] || ""}
                        onChange={(e) =>
                          setSelectedNatures((prevSelected) => ({
                            ...prevSelected,
                            [teamItem.pokemon.name]: e.target.value,
                          }))
                        }
                      >
                        <option className="team-slot-dropdown-options" value="">
                          Nature
                        </option>
                        {allNatures.map((nature) => (
                          <option
                            className="team-slot-dropdown-options"
                            key={nature.name}
                            value={nature.name}
                          >
                            {capitaliseEachWord(nature.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <img src={question} className="question-mark" />
                </div>
              )}
            </div>
          </div>
        );
      })}
      {modalIsOpen && selectedPokemon && (
        <Modal
          id={selectedPokemon.id.toString().padStart(3, "0")}
          icon={
            selectedPokemon.sprites.versions["generation-viii"].icons
              .front_default
          }
          homeImage={selectedPokemon.sprites.other.home.front_default}
          animatedImage={
            selectedPokemon.sprites.versions["generation-v"]["black-white"]
              .animated.front_default
          }
          animatedImageBack={
            selectedPokemon.sprites.versions["generation-v"]["black-white"]
              .animated.back_default
          }
          shinyAnimatedImage={
            selectedPokemon.sprites.versions["generation-v"]["black-white"]
              .animated.front_shiny
          }
          shinyAnimatedImageBack={
            selectedPokemon.sprites.versions["generation-v"]["black-white"]
              .animated.back_shiny
          }
          name={selectedPokemon.name.replace(/^./, (str) => str.toUpperCase())}
          isLegendary={selectedPokemon.is_legendary}
          type={getPokemonTypes(selectedPokemon)}
          typeImages={getPokemonTypeImages(selectedPokemon)}
          typeImagesClassName="type-image-container"
          weight={selectedPokemon.weight}
          height={selectedPokemon.height}
          stats={selectedPokemon.stats
            .map((stat) => stat.base_stat)
            .slice(0, 6)}
          statsName={selectedPokemon.stats
            .map((stat, index) =>
              index === 0 ? stat.stat.name.toUpperCase() : stat.stat.name
            )
            .slice(0, 6)}
          moves={selectedPokemon.moves.map((move) => move.move.name)}
          abilities={selectedPokemon.abilities.map(
            (ability) => ability.ability.name
          )}
          onClick={() => setModalIsOpen(false)}
        />
      )}
    </div>
  );
}

export default TeamBuilder;
