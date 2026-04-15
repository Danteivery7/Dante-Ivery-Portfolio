import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <div data-testid="home-page">
      <HeroSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
