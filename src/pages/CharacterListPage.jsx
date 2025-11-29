import React, { useState, useEffect } from 'react';
import CharacterList from '../components/CharacterList';
import './CharacterListPage.css';

const CharacterListPage = () => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // In a real app, you would fetch from an API
        // For now, we'll use mock data
        const mockCharacters = [
          {
            name: "The Herta",
            rarity: 5,
            element: "Ice",
            path: "Erudition",
            description: "A brilliant scholar who serves as the Icewind Suite's Icewind Architect.",
            imageName: "The_Herta"
          },
          {
            name: "Dan Heng",
            rarity: 4,
            element: "Wind",
            path: "Destruction",
            description: "A former Windriders member who now serves as a Trailblazer.",
            imageName: "Dan_Heng"
          },
          // Add more mock characters as needed
          // In a real app, you would have 50+ characters
        ];

        // Duplicate to simulate 50+ characters
        const allCharacters = [];
        for (let i = 0; i < 10; i++) {
          allCharacters.push(...mockCharacters.map(char => ({
            ...char,
            name: `${char.name} ${i > 0 ? i : ''}`,
            imageName: `${char.imageName}${i > 0 ? `_${i}` : ''}`
          })));
        }

        setCharacters(allCharacters);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading characters...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="character-list-page">
      <h1 className="page-title">Character List</h1>
      <CharacterList characters={characters} />
    </div>
  );
};

export default CharacterListPage;
