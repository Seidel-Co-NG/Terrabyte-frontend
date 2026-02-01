import React from 'react';

const Action: React.FC = () => {
  return (
    <section className="mt-8 sm:mt-12 md:mt-16 lg:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-text-primary leading-snug">
            Data. Bills. Airtime. Cards — All in One Device.
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 dark:text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            TERRABYTE puts everything you need in one place — no stress, no switching apps.
            Just fast, simple, and secure transactions.
          </p>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <img
            src="/img/mac.png"
            alt="TERRABYTE platform overview"
            className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl transition-all duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default Action;

