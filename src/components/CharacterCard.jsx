import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CharacterCard.css';

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
          onError={(e) => {
            e.target.src = '/images/Unknown.png';
          }}
        />

        <img
          src={portraitPath}
          alt={`${character.name} portrait`}
          className="portrait-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder_portrait.png';
          }}
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
              onError={(e) => {
                e.target.src = '/images/placeholder_avatar.png';
              }}
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
              onError={(e) => {
                e.target.src = '/images/Unknown.png';
              }}
            />
            <span className="tooltip-path-text">{character.path}</span>
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
