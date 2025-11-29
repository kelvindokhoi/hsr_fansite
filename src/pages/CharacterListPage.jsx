import React, { useState, useEffect } from 'react';
import PillNav from '../components/PillNav';
import CharacterList from '../components/CharacterList';
import GradientText from '../components/GradientText'; // Import GradientText
import { useAuth } from '../context/AuthContext';
import HSRLogoEvernight from '../assets/HSR_Logo_Evernight.png'; // Import your logo
import '../css/CharacterListPage.css';

const CharacterListPage = () => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();

  // Define navigation items
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Character List', href: '/character-list' },
    { label: 'Gacha Pulling', href: '/gacha-pulling' }
  ];

  useEffect(() => {
    const mockCharacters = [
      {
        name: "Blade",
        rarity: 5,
        element: "Wind",
        path: "Destruction",
        description: "A member of the Stellaron Hunters who wields the power of wind.",
        imageName: "Blade"
      }
    ];

    const timer = setTimeout(() => {
      setCharacters(mockCharacters);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="page-container">
        <PillNav
          logo={HSRLogoEvernight}
          logoAlt="Honkai: Star Rail Logo"
          items={navItems}
          activeHref="/character-list"
          baseColor="#753eceff"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
        <div className="loading">Loading characters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <PillNav
          logo={HSRLogoEvernight}
          logoAlt="Honkai: Star Rail Logo"
          items={navItems}
          activeHref="/character-list"
          baseColor="#753eceff"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
        <div className="error">
          {error === "Not authenticated"
            ? "Please log in to view characters"
            : `Error loading characters: ${error}`}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PillNav
        logo={HSRLogoEvernight}
        logoAlt="Honkai: Star Rail Logo"
        items={navItems}
        activeHref="/character-list"
        baseColor="#753eceff"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
      />
      <div className="character-list-page">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
          className="Page-Title"
        >
          Character List
        </GradientText>
        <CharacterList characters={characters} />
      </div>
    </div>
  );
};

export default CharacterListPage;
