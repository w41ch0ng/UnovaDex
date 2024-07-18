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
  moveDetailsModalHandler,
  closeMoveDetailsModalHandler,
  abilityDetailsModalHandler,
  closeAbilityDetailsModalHandler,
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

  useEffect(() => {
    if (moves.length > 0) {
      fetchMoveData(moves[0]).then((data) => {
        setSelectedMove(data);
        moveDetailsModalHandler();
      });
    }

    if (abilities.length > 0) {
      fetchAbilityData(abilities[0]).then((data) => {
        setSelectedAbility(data);
        abilityDetailsModalHandler();
      });
    }
  }, [moves, abilities]);

  function moveDetailsModalHandler() {
    setMoveDetailsModalIsOpen(true);
  }

  function closeMoveDetailsModalHandler() {
    setMoveDetailsModalIsOpen(false);
  }

  function abilityDetailsModalHandler() {
    setAbilityDetailsModalIsOpen(true);
  }

  function closeAbilityDetailsModalHandler() {
    setAbilityDetailsModalIsOpen(false);
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
              onClose={closeMoveDetailsModalHandler}
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
              onClose={closeAbilityDetailsModalHandler}
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
