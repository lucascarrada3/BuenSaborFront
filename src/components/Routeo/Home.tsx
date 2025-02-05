import React from 'react';
import ProductCarousel from '../Introduccion/Carousel';
import AboutUs from '../Introduccion/AboutUs';
import Testimonials from '../Introduccion/Testimonials';

const Home: React.FC = () => {
  return (
    <>
      <ProductCarousel />
      <AboutUs />
      <Testimonials />
    </>
  );
};

export default Home;
