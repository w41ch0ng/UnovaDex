import "./styles.css";
import { CapitaliseEachWordContext } from "./PokeList";
import { useContext, useState } from "react";
import { TypeImageContext } from "./PokeList";
import { DmgClassImageContext } from "./PokeList";
import moveslotimage from "../images/slots/moveslot.png";
import selectedMoveslotImage from "../images/slots/move slot green highlight.png";
import { handleMoveClick, handleAbilityClick, fetchMoveData } from "./utils";

function MoveDetailsModal({
  moves,
  selectedMove,
  handleMoveClick,
  moveData,
  setSelectedMove,
  moveDetailsModalHandler,
  onClose,
}) {
  const { getTypeImage } = useContext(TypeImageContext);
  const { getDmgClassImage } = useContext(DmgClassImageContext);
  const { capitaliseEachWord } = useContext(CapitaliseEachWordContext);
  const [hoveredMove, setHoveredMove] = useState(null);
  const hasEffectEntries =
    moveData.effect_entries && moveData.effect_entries.length > 0;

  const hasEffectChance =
    hasEffectEntries &&
    moveData.effect_entries[0].short_effect.includes("$effect_chance");

  const modifiedShortEffect = hasEffectChance
    ? moveData.effect_entries[0].short_effect.replace(
        "$effect_chance",
        `${moveData.effect_chance}`
      )
    : null;

  return (
    <div className="move-full-container">
      <div className="move-ability-container">
        <div className="move-ability-details">
          <p className="move-ability-details">Power</p>
          <p className="move-ability-details">Accuracy</p>
          <p className="move-ability-details">PP</p>
          <p className="move-ability-details">Type</p>
          <p className="move-ability-details">Damage Class</p>
          <p className="move-ability-description-effect">Description</p>
        </div>
        <div className="move-ability-details">
          <p className="move-ability-details">{moveData.power || "--"}</p>
          <p className="move-ability-details">{moveData.accuracy || "--"}</p>
          <p className="move-ability-details">{moveData.pp || "--"}</p>
          <p className="move-ability-details">
            {moveData.type ? (
              <img
                src={getTypeImage(moveData.type.name)}
                alt={moveData.type.name}
              />
            ) : (
              "--"
            )}
          </p>
          <p className="move-ability-details">
            {moveData.damage_class ? (
              <img
                src={getDmgClassImage(moveData.damage_class.name)}
                alt={moveData.damage_class.name}
              />
            ) : (
              "--"
            )}
          </p>

          {hasEffectEntries && (
            <p className="description-effect">
              {hasEffectChance
                ? modifiedShortEffect
                : moveData.effect_entries[0].short_effect}
            </p>
          )}
          {!hasEffectEntries && (
            <p className="description-effect">Description: --.</p>
          )}
        </div>
      </div>
      <div className="moves-container">
        <div>
          {moves.map((move) => (
            <div
              className={`moveslots-abilityslots ${
                selectedMove && selectedMove.name === move ? "selected" : ""
              }`}
              onClick={() => {
                handleMoveClick(
                  move,
                  fetchMoveData,
                  setSelectedMove,
                  moveDetailsModalHandler
                );
              }}
            >
              <img
                src={
                  selectedMove && selectedMove.name === move
                    ? selectedMoveslotImage
                    : moveslotimage
                }
                alt="Move Slot"
              />
              <p
                className={`moves ${
                  selectedMove && selectedMove.name === move ? "selected" : ""
                }`}
              >
                {move}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoveDetailsModal;
