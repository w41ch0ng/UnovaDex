import React, { useContext, useState } from "react";
import "./styles.css";
//import pokeball from "../images/pokelistspritenew.png";
import Modal from "./Modal";
import { CapitaliseEachWordContext } from "./PokeList";
import pokedexentry from "../images/slots/pokedexentry.png";
import addButtonImage from "../images/slots/moveslot.png";
import { playHoverSound } from "./utils";

function PokemonCard({
  id,
  name,
  icon,
  homeImage,
  animatedImage,
  animatedImageBack,
  shinyAnimatedImage,
  shinyAnimatedImageBack,
  abilities,
  type,
  typeImages,
  weight,
  height,
  stats,
  statsName,
  moves,
  forms,
  onAddToTeam,
  team,
  pokemon,
  setTeam,
}) {
  const [isShown, setIsShown] = useState(false); // HOVER STATE USE THIS "IS SHOWN"
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function modalHandler() {
    setModalIsOpen(true);
  }
  function closeModalHandler() {
    setModalIsOpen(false);
  }

  const { capitaliseEachWord } = useContext(CapitaliseEachWordContext);

  return (
    <div className="pokemon-container">
      <img src={pokedexentry} />
      <div
        className="pokemon-details-container"
        onMouseEnter={() => {
          playHoverSound();
        }}
        onClick={modalHandler}
      >
        <img src={icon} className="pokemon-icon" alt={name} />
        {/* <img src={pokeball} alt="pokeball" className="pokeball-img" /> */}
        <div className="pokemon-name-id-container">
          <div className="pokemon-id-container">
            <p className="pokemon-id pokemon-details-container-text">{id}</p>
          </div>
          <div className="pokemon-name-container">
            <p className="pokemon-details-container-text">
              {capitaliseEachWord(name)}
            </p>
          </div>
        </div>
        <div
          className="add-to-team"
          onClick={(e) => {
            e.stopPropagation();
            onAddToTeam(pokemon, team, setTeam);
          }}
        >
          <img src={addButtonImage} className="add-to-team-button" />
          <p className="add-to-team-text">Add to Team</p>
        </div>
      </div>
      {modalIsOpen && (
        <Modal
          id={id}
          name={name}
          icon={icon}
          homeImage={homeImage}
          animatedImage={animatedImage}
          animatedImageBack={animatedImageBack}
          shinyAnimatedImage={shinyAnimatedImage}
          shinyAnimatedImageBack={shinyAnimatedImageBack}
          abilities={abilities}
          weight={weight}
          height={height}
          stats={stats}
          statsName={statsName}
          type={type}
          typeImages={typeImages}
          moves={moves}
          forms={forms}
          onClick={closeModalHandler}
        />
      )}
    </div>
  );
}

export default PokemonCard;
