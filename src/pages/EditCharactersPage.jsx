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

  // Image loading utilities (copied from CharacterCard)
  const getFallbackPath = (type) => {
    switch(type) {
      case 'portrait':
        return '/images/placeholder_portrait.png';
      case 'avatar':
        return '/images/placeholder_avatar.png';
      default:
        return '/images/Unknown.png';
    }
  };

  const getImagePath = (baseName, type) => {
    return new Promise((resolve) => {
      const extensions = ['png', 'jpg'];
      let currentIndex = 0;

      const tryNext = async () => {
        if (currentIndex >= extensions.length) {
          console.log(`No valid image found for ${baseName}_${type}, using fallback`);
          resolve(getFallbackPath(type));
          return;
        }

        const ext = extensions[currentIndex++];
        // URL encode the path but keep the forward slashes
        const path = `/images/${encodeURIComponent(baseName)}_${type}.${ext}`.replace(/%2F/g, '/');
        console.log(`Trying to load: ${path}`);

        try {
          const img = new Image();
          const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 1000)
          );

          const loadImage = new Promise((resolve, reject) => {
            img.onload = () => resolve(path);
            img.onerror = () => reject(new Error('load error'));
            img.src = path;
          });

          const result = await Promise.race([loadImage, timeout]);
          console.log(`Found image at: ${result}`);
          resolve(result);
        } catch (error) {
          console.log(`Failed to load: ${path} - ${error.message}`);
          tryNext();
        }
      };

      tryNext();
    });
  };

  const elements = ['Fire', 'Ice', 'Imaginary', 'Lightning', 'Physical', 'Quantum', 'Wind'];
  const paths = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'The Hunt', 'Remembrance'];
  const rarities = [4, 5];

  useEffect(() => {
    console.log('User object:', user); // Debug log
    if (!user) {
      setError('Access denied. Please log in.');
      setLoading(false);
      return;
    }
    
    // Check for admin role using multiple possible fields
    const isAdmin = user.role_name === 'admin' || user.is_admin === 1 || user.role === 'admin';
    
    if (!isAdmin) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    
    fetchCharacters();
  }, [user]);

  const fetchCharacters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/hsrapp/api/management/getCharacter.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setCharacters(data.characters || []);
      } else {
        setError(data.message || data.error || 'Failed to fetch characters');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Fetch error:', err);
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
      const token = localStorage.getItem('token');
      const url = editingCharacter 
        ? 'http://localhost/hsrapp/api/management/update_character.php'
        : 'http://localhost/hsrapp/api/management/addCharacter.php';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/hsrapp/api/management/delete_character.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

  // Character Card Component with image loading
  const CharacterCard = ({ character, onEdit, onDelete }) => {
    const [portraitPath, setPortraitPath] = useState('');
    const [elementPath, setElementPath] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;

      const loadImages = async () => {
        try {
          setIsLoading(true);
          const imageName = character.imageName || character.name.replace(/\s+/g, '_');
          const [portrait] = await Promise.all([
            getImagePath(imageName, 'portrait')
          ]);

          if (isMounted) {
            setPortraitPath(portrait);
            setElementPath(`/images/${character.element}.png`);
          }
        } catch (error) {
          console.error('Error loading images:', error);
          if (isMounted) {
            setPortraitPath('/images/placeholder_portrait.png');
            setElementPath('/images/Unknown.png');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      loadImages();

      return () => {
        isMounted = false;
      };
    }, [character.name, character.element, character.imageName]);

    const rarityClass = character.rarity === 5 ? 'five-star' : 'four-star';

    if (isLoading) {
      return (
        <div className="character-card loading">
          <div className="loading-placeholder">Loading...</div>
        </div>
      );
    }

    return (
      <div className={`character-card ${rarityClass}`}>
        {/* Portrait Section */}
        <div className="portrait-section">
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

        {/* Info Section */}
        <div className="info-section">
          <p className="character-details">{character.element} • {character.path} • {character.rarity}★</p>
          {character.description && (
            <p className="character-description">{character.description}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="actions-section">
          <button 
            onClick={() => onEdit(character)}
            className="edit-btn"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(character.id)}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error && (!user || !(user.role_name === 'admin' || user.is_admin === 1 || user.role === 'admin'))) {
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
                <CharacterCard 
                  key={character.id} 
                  character={character}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCharactersPage;