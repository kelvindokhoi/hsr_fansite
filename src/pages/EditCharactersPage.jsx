import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PillNav from '../components/PillNav';
import GradientText from '../components/GradientText.jsx';
import DotGrid from '../components/DotGrid.jsx';
import '../css/EditCharactersPage.css';
import HSRLogoMarch7 from "../assets/HSR_Logo_March7.png";

const EditCharactersPage = () => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    element: '',
    path: '',
    rarity: 5,
    description: '',
    image: null
  });

  const elements = ['Fire', 'Ice', 'Imaginary', 'Lightning', 'Physical', 'Quantum', 'Wind'];
  const paths = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'The Hunt', 'Remembrance'];
  const rarities = [4, 5];

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    fetchCharacters();
  }, [user]);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('http://localhost/hsrapp/api/characters.php');
      const data = await response.json();
      if (data.success) {
        setCharacters(data.characters);
      } else {
        setError(data.message || 'Failed to fetch characters');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    if (editingCharacter) {
      data.append('id', editingCharacter.id);
    }

    try {
      const url = editingCharacter 
        ? 'http://localhost/hsrapp/api/update_character.php'
        : 'http://localhost/hsrapp/api/add_character.php';
      
      const response = await fetch(url, {
        method: 'POST',
        body: data
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchCharacters();
        resetForm();
      } else {
        setError(result.message || 'Operation failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this character?')) {
      return;
    }

    try {
      const response = await fetch('http://localhost/hsrapp/api/delete_character.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchCharacters();
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const startEdit = (character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      element: character.element,
      path: character.path,
      rarity: character.rarity,
      description: character.description || '',
      image: null
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      element: '',
      path: '',
      rarity: 5,
      description: '',
      image: null
    });
    setEditingCharacter(null);
    setIsEditing(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error && (!user || user.role !== 'admin')) {
    return (
      <div className="edit-characters-page">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-characters-page">
      <DotGrid
        dotSize={2}
        gap={15}
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />

      <PillNav
        logo={HSRLogoMarch7}
        logoAlt="Honkai: Star Rail Logo"
        items={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Character List', href: '/character-list' },
          { label: 'Edit Characters', href: '/edit-characters' },
          { label: 'Gacha Pulling', href: '/gacha-pulling' },
          { label: 'Credits', href: '/credits' }
        ]}
        activeHref="/edit-characters"
        className="custom-nav"
        baseColor="#753eceff"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
      />

      <div className="edit-characters-content">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
          className="Page-Title"
        >
          Edit Characters
        </GradientText>

        {error && <div className="error-message">{error}</div>}

        <div className="edit-characters-container">
          {/* Character Form */}
          <div className="character-form">
            <h3>{isEditing ? 'Edit Character' : 'Add New Character'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Element:</label>
                  <select
                    name="element"
                    value={formData.element}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Element</option>
                    {elements.map(element => (
                      <option key={element} value={element}>{element}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Path:</label>
                  <select
                    name="path"
                    value={formData.path}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Path</option>
                    {paths.map(path => (
                      <option key={path} value={path}>{path}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Rarity:</label>
                  <select
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleInputChange}
                    required
                  >
                    {rarities.map(rarity => (
                      <option key={rarity} value={rarity}>{rarity}★</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image && (
                  <div className="image-preview">
                    <img src={URL.createObjectURL(formData.image)} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  {isEditing ? 'Update Character' : 'Add Character'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Characters List */}
          <div className="characters-list">
            <h3>Existing Characters</h3>
            <div className="characters-grid">
              {characters.map(character => (
                <div key={character.id} className="character-card">
                  {character.image && (
                    <img 
                      src={`http://localhost/hsrapp/images/${character.image}`} 
                      alt={character.name}
                      className="character-image"
                    />
                  )}
                  <div className="character-info">
                    <h4>{character.name}</h4>
                    <p>{character.element} • {character.path} • {character.rarity}★</p>
                    {character.description && (
                      <p className="character-description">{character.description}</p>
                    )}
                  </div>
                  <div className="character-actions">
                    <button 
                      onClick={() => startEdit(character)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(character.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCharactersPage;