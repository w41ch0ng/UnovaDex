import pokeball from "../images/pokeballs/Poke_Ball.png";
import battle from "../images/backgrounds/poke bg 1.jpeg";
import redXbutton from "../images/sprites/redxbutton.png";
import "./styles.css";
import MoveDetailsModal from "./MoveDetailsModal";
import AbilityDetailsModal from "./AbilityDetailsModal";
import React, { useContext, useState, useEffect } from "react";
import { CapitaliseEachWordContext } from "./PokeList";
import {
  fetchMoveData,
  fetchAbilityData,
  handleMoveClick,
  handleAbilityClick,
} from "./utils";

function Modal({
  onClick,
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
  moveData,
  abilityData,
}) {
  const [moveDetailsModalIsOpen, setMoveDetailsModalIsOpen] = useState(false);
  const [abilityDetailsModalIsOpen, setAbilityDetailsModalIsOpen] =
    useState(false);
  const [selectedMove, setSelectedMove] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const { capitaliseEachWord } = useContext(CapitaliseEachWordContext);

  // useEffect hook for when 'moves' or 'abilities' change
  useEffect(() => {
    // Check if there are any moves in the 'moves' array
    if (moves.length > 0) {
      // Fetch data for the first move in the array
      fetchMoveData(moves[0]).then((data) => {
        // Set the fetched data as the selected move
        setSelectedMove(data);
        // Update modal displaying the move details
        moveDetailsModalHandler();
      });
    }

    // Check if there are any abilities in the 'abilities' array
    if (abilities.length > 0) {
      // Fetch data for the first ability in the array
      fetchAbilityData(abilities[0]).then((data) => {
        // Set the fetched data as the selected ability
        setSelectedAbility(data);
        // Update modal displaying the ability details
        abilityDetailsModalHandler();
      });
    }
    // Re-run when either moves or abilities arrays changes.
  }, [moves, abilities]);

  // Function to open the move details modal
  function moveDetailsModalHandler() {
    // Set the state to indicate that the move details modal is open
    setMoveDetailsModalIsOpen(true);
  }

  // Function to open the ability details modal
  function abilityDetailsModalHandler() {
    // Set the state to indicate that the ability details modal is open
    setAbilityDetailsModalIsOpen(true);
  }

  return (
    <div className="modal">
      <div className="modal-wrapper">
        <div className="close-modal" onClick={onClick}>
          <img src={redXbutton} alt="Close Modal" />
        </div>
        <div className="container">
          <div className="container-title">
            <img src={icon} alt={name} className="image-title" />
            <p className="id-title">No. {id}</p>
            <p>{capitaliseEachWord(name)}</p>
            <div className="type-image-container">
              {typeImages.map((type, index) => (
                <p key={index}>
                  <img src={type.image} alt={type.name} />
                  {type.name}
                </p>
              ))}
            </div>
            <img src={pokeball} alt="pokeball" className="pokeball-title" />
          </div>

          <div className="battlefield">
            <img src={battle} alt={"bw-field"} className="bw-field" />
            <div className="front-sprite-container">
              <img
                src={animatedImage}
                alt={name + "Sprite"}
                className="front-sprite"
              />
            </div>
            <div className="shiny-sprite-container">
              <img
                src={shinyAnimatedImage}
                alt={name + "Shiny Sprite"}
                className="shiny-sprite"
              />
            </div>
            <div className="back-sprite-container">
              <img
                src={animatedImageBack}
                alt={name + "Back Sprite"}
                className="back-sprite"
              />
            </div>
            <div className="back-shiny-sprite-container">
              <img
                src={shinyAnimatedImageBack}
                alt={name + "Shiny Back Sprite"}
                className="back-shiny-sprite"
              />
            </div>
          </div>
          <div className="base-stats">
            <div>
              {statsName.map((stats) => (
                <p className="stats stats-name">{stats}</p>
              ))}
            </div>
            <div>
              {stats.map((stats) => (
                <p className="stats">{stats}</p>
              ))}
            </div>
          </div>
          {selectedMove && (
            <MoveDetailsModal
              moves={moves}
              selectedMove={selectedMove}
              moveData={selectedMove}
              handleMoveClick={(moveName) =>
                handleMoveClick(
                  moveName,
                  fetchMoveData,
                  setSelectedMove,
                  moveDetailsModalHandler
                )
              }
            />
          )}
          {selectedAbility && (
            <AbilityDetailsModal
              abilities={abilities}
              selectedAbility={selectedAbility}
              abilityData={selectedAbility}
              handleAbilityClick={(abilityName) =>
                handleAbilityClick(
                  abilityName,
                  fetchAbilityData,
                  setSelectedAbility,
                  abilityDetailsModalHandler
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
