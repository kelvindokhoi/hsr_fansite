import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CharacterCard.css';

const CharacterCard = ({ character }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [portraitPath, setPortraitPath] = useState('');
  const [avatarPath, setAvatarPath] = useState('');
  const [elementPath, setElementPath] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/characters/${character.imageName}`);
  };

  const rarityClass = character.rarity === 5 ? 'five-star' : 'four-star';

const getImagePath = (baseName, type) => {
  return new Promise((resolve) => {
    const extensions = ['png', 'jpg', 'jpeg'];
    let currentIndex = 0;

    console.log(`Looking for ${baseName}_${type} with extensions:`, extensions);

    const checkNext = () => {
      if (currentIndex >= extensions.length) {
        console.log(`No valid image found for ${baseName}_${type}, using fallback`);
        resolve(getFallbackPath(type));
        return;
      }

      const ext = extensions[currentIndex++];
      const path = `/images/${baseName}_${type}.${ext}`;
      console.log(`Checking: ${path}`);
      
      const img = new Image();
      
      // Set a timeout to handle cases where the image might be taking too long to load
      const timeoutId = setTimeout(() => {
        console.log(`Timeout checking: ${path}`);
        img.onload = img.onerror = null;
        checkNext();
      }, 1000); // 1 second timeout

      img.onload = () => {
        clearTimeout(timeoutId);
        console.log(`Found image at: ${path}`);
        resolve(path);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        console.log(`Not found: ${path}`);
        checkNext();
      };

      // Start loading the image
      img.src = path;
    };

    checkNext();
  });
};

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const [portrait, avatar] = await Promise.all([
          getImagePath(character.imageName, 'portrait'),
          getImagePath(character.imageName, 'avatar')
        ]);
        
        setPortraitPath(portrait);
        setAvatarPath(avatar);
        setElementPath(`/images/${character.element}.png`);
      } catch (error) {
        console.error('Error loading images:', error);
        // Set fallback paths in case of error
        setPortraitPath('/images/placeholder_portrait.png');
        setAvatarPath('/images/placeholder_avatar.png');
        setElementPath('/images/Unknown.png');
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [character.imageName, character.element]);

  if (isLoading) {
    return <div className="character-card loading">Loading...</div>;
  }

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