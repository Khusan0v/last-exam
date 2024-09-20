import React from 'react';
import heroImage from '../assets/Hero.jpg';
import { Carusel } from './Carousel/Carousel';

export default function Hero() {
  return (
    <div>
      <div
        className="relative bg-cover bg-center w-full h-[400px]"
        style={{ backgroundImage: `url(${heroImage})` }}  
      >
        <div className="absolute inset-0 flex justify-center m-[69px]">
          <div className="max-w-[1280px]  px-4">
            <h1 className="font-montserrat font-bold text-6xl text-[#87CEEB]">CRYPTOFOLIO WATCH LIST</h1>
            <p className="text-[#A9A9A9] text-center">Get all the Info regarding your favorite Crypto Currency</p>
            <Carusel/>
          </div>
        </div>
      </div>
    </div>
  );
}


