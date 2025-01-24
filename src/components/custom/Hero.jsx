/* eslint-disable no-unused-vars */
import React from 'react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import './CSS/Hero.css';  // Import the Hero.css file

function Hero() {
  return (
    <div className="hero-container">
      <h1 className="hero-heading">
        <span>Discover Your Next Adventure AI:</span> Personalized Itineraries at Your Fingertips
      </h1>
      <p className="hero-paragraph">
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>
      <Link to={'/create-trip'}>
        <Button className="hero-button">Get Started! It&apos;s Free</Button>
      </Link>
      <img src='/homeimg.jpeg' className='hero-image'/>
    </div>
  );
}

export default Hero;
