import pokeball from "../images/pokeballs/Poke_Ball.png";
import battle from "../images/backgrounds/poke-bg-1.jpeg";
import redXbutton from "../images/sprites/redxbutton.png";
import "../css/styles.css";
import MoveDetailsModal from "./MoveDetailsModal.tsx";
import AbilityDetailsModal from "./AbilityDetailsModal.tsx";
import { useState, useEffect } from "react";
import {
  fetchMoveData,
  fetchAbilityData,
  handleMoveClick,
  handleAbilityClick,
  capitaliseEachWord,
} from "../utils/utils.ts";
import { ModalProps, MoveData, AbilityData } from "../utils/interfaces.ts";

function Modal({
  onClick,
  id,
  name,
  //is_legendary,
  icon,
  //homeImage,
  animatedImage,
  animatedImageBack,
  shinyAnimatedImage,
  shinyAnimatedImageBack,
  abilities,
  //type,
  typeImages,
  //weight,
  //height,
  //forms,
  stats,
  statsName,
  moves,
}: ModalProps) {
  const [selectedMove, setSelectedMove] = useState<MoveData | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<AbilityData | null>(
    null
  );

  // useEffect hook for when 'moves' or 'abilities' change
  useEffect(() => {
    // Check if there are any moves in the 'moves' array
    if (moves.length > 0) {
      // Fetch data for the first move in the array
      fetchMoveData(moves[0]).then((data) => {
        // Set the fetched data as the selected move
        setSelectedMove(data);
      });
    }

    // Check if there are any abilities in the 'abilities' array
    if (abilities.length > 0) {
      // Fetch data for the first ability in the array
      fetchAbilityData(abilities[0]).then((data) => {
        // Set the fetched data as the selected ability
        setSelectedAbility(data);
      });
    }
    // Re-run when either moves or abilities arrays changes.
  }, [moves, abilities]);

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
                handleMoveClick(moveName, fetchMoveData, setSelectedMove)
              }
              setSelectedMove={setSelectedMove}
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
                  setSelectedAbility
                )
              }
              setSelectedAbility={setSelectedAbility}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
