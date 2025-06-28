import React from 'react';
import Mac from '../assets/Mac2.png'

const Action: React.FC = () => {
  return (
    <>
      <div className="text-center mt-12 sm:mt-16 lg:mt-24 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          Data. Bills. Airtime. Cards — All in One Device.
        </h2>
        <p className="mt-3 text-gray-600 text-sm md:text-base max-w-xl mx-auto">
          TERRABYTE puts everything you need in one place — no stress, no switching apps.
          Just fast, simple, and secure transactions.
        </p>
      </div>

      <div className="flex justify-center mt-8 px-4">
        <img
          src={Mac}
          alt="TERRABYTE platform overview"
          className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl transition-all duration-300"
        />
      </div>
    </>
  );
};

export default Action;

