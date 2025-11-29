import { useState } from 'react';
import HSRLogo from '../assets/hsr_logo.png';
import PillNav from '../components/PillNav';
import GradientText from '../components/GradientText.jsx';
import DotGrid from '../components/DotGrid.jsx';
import UserMenu from '../components/UserMenu.jsx';
import '../css/About.css';
import StellarJadePNG from '../assets/Item_Stellar_Jade.png';
import HSRLogoMarch7 from "../assets/HSR_Logo_March7.png";

function About() {
  return (
    <div className="about-page">
      <DotGrid 
        dotSize={2} 
        gap={15} 
        baseColor="#5227FF" 
        activeColor="#5227FF" 
        proximity={120} 
        shockRadius={250} 
        shockStrength={5} 
        resistance={750} 
        returnDuration={1.5}
      />
      
      <UserMenu stellarJadeIcon={StellarJadePNG}/>
      
      <PillNav
        logo={HSRLogoMarch7} 
        logoAlt="Honkai: Star Rail Logo"
        items={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Character List', href: '/character-list' },
          { label: 'Gacha Pulling', href: '/gacha-pulling' }
        ]}
        activeHref="/about" 
        className="custom-nav" 
        baseColor="#753eceff" 
        pillColor="#ffffff" 
        hoveredPillTextColor="#ffffff" 
        pillTextColor="#000000"
      />
      
      <div className="about-content">
        <GradientText 
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} 
          animationSpeed={3} 
          showBorder={false} 
          className="Page-Title"
        >
          About This Project
        </GradientText>
        
        <div className="about-text">
          <p>
            Welcome to the Honkai: Star Rail Simulation! This interactive web experience 
            brings the universe of Honkai: Star Rail to life with stunning visuals and 
            engaging features.
          </p>
          
          <h2 className="about-heading">Features</h2>
          <ul>
            <li>Interactive character roster</li>
            <li>Gacha simulation system</li>
            <li>Beautiful animated UI</li>
            <li>Responsive design</li>
          </ul>
          
          <h2 className="about-heading">Technologies Used</h2>
          <ul>
            <li>React</li>
            <li>GSAP for animations</li>
            <li>Custom CSS animations</li>
            <li>React Router</li>
            <li>ReactBit's Opensource UI components</li>
          </ul>
          
          <p style={{ marginTop: '2rem', fontStyle: 'italic', marginBottom: '3rem' }}>
            Made with ❤️ by K.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;