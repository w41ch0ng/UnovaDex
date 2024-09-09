import { useState } from "react";
import "../css/styles.css";
import Modal from "./Modal.tsx";
import pokedexentry from "../images/slots/pokedexentry.png";
import addButtonImage from "../images/slots/moveslot.png";
import { playHoverSound, capitaliseEachWord } from "../utils/utils.ts";
import { PokeListProps } from "../utils/interfaces.ts";

function PokeList({
  id,
  name,
  is_legendary,
  icon,
  homeImage,
  animatedImage,
  animatedImageBack,
  shinyAnimatedImage,
  shinyAnimatedImageBack,
  abilities,
  //type,
  //typeImages,
  getPokemonTypes,
  getPokemonTypeImages,
  weight,
  height,
  stats,
  statsName,
  moves,
  //forms,
  onAddToTeam,
  team,
  pokemon,
  setTeam,
}: PokeListProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Function to open the modal for a Pokémon
  function modalHandler() {
    setModalIsOpen(true);
  }

  // Function to close the modal - passed down to the modal as modalIsOpen state is here
  function closeModalHandler() {
    setModalIsOpen(false);
  }

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
          is_legendary={is_legendary}
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
          type={getPokemonTypes}
          typeImages={getPokemonTypeImages}
          moves={moves}
          //forms={forms}
          onClick={closeModalHandler}
        />
      )}
    </div>
  );
}

export default PokeList;
