import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CharacterCard.css';

const CharacterCard = ({ character }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/characters/${character.imageName}`);
  };

  const rarityClass = character.rarity === 5 ? 'five-star' : 'four-star';
  const portraitPath = `/images/${character.imageName}_portrait.png`;
  const avatarPath = `/images/${character.imageName}_avatar.png`;
  const elementPath = `/images/${character.element}.png`;
  const pathPath = `/images/${character.path}.png`;

  return (
    <div
      className={`character-card ${rarityClass}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Character: ${character.name}, ${character.rarity} star, ${character.element} element, ${character.path} path`}
      role="button"
      tabIndex="0"
    >
      <div className="card-content">
        <img
          src={elementPath}
          alt={`${character.element} element`}
          className="element-icon"
          loading="lazy"
        />

        <img
          src={portraitPath}
          alt={`${character.name} portrait`}
          className="portrait-image"
          loading="lazy"
        />

        <div className="name-mask">
          <span className="character-name">{character.name}</span>
        </div>
      </div>

      {isHovered && (
        <div className="tooltip">
          <div className="tooltip-header">
            <img
              src={avatarPath}
              alt={`${character.name} avatar`}
              className="avatar-image"
              loading="lazy"
            />
            <div className="tooltip-name-rarity">
              <span className="tooltip-name">{character.name}</span>
              <div className="tooltip-rarity">
                {Array(character.rarity).fill('★').join('')}
              </div>
            </div>
          </div>

          <div className="tooltip-details">
            <img
              src={elementPath}
              alt={`${character.element} element`}
              className="tooltip-element"
            />
            <img
              src={pathPath}
              alt={`${character.path} path`}
              className="tooltip-path"
            />
          </div>

          <div className="tooltip-description">
            {character.description || "No description available"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
