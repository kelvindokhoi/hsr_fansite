import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';

const MusicSettings = ({ songSrc, title }) => {
    const { playTrack, volume, setVolume, isMuted, toggleMute } = useAudio();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (songSrc) {
            playTrack(songSrc);
        }
    }, [songSrc, playTrack]);

    return (
        <div className="music-settings-container" style={{
            position: 'fixed',
            left: '1rem',
            top: '8rem',  /* Changed from 5rem to 11rem to move it down by 60 pixels */
            zIndex: 10000,
            display: 'flex',
            alignItems: 'flex-start'
        }}>
            {isOpen && (
                <div className="bg-gray-800/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg w-64 border border-gray-700 animate-fade-in ml-2" style={{
                    position: 'relative',
                    zIndex: 10001,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-300">Music Settings</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    {title && (
                        <div className="mb-3 text-xs text-blue-300 truncate">
                            Now Playing: {title}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleMute}
                            className="p-1 rounded hover:bg-gray-700 focus:outline-none"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                    <line x1="23" y1="9" x2="17" y2="15"></line>
                                    <line x1="17" y1="9" x2="23" y2="15"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                </svg>
                            )}
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="music-settings-button hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none flex items-center justify-center"
                title="Music Settings"
                style={{ width: '48px', height: '48px' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            </button>
        </div>
    );
};

export default MusicSettings;
