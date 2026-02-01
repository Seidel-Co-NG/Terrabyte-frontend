import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';


export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-white to-gray-50 dark:from-bg-primary dark:to-bg-secondary py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex lg:items-center">
        <div className="w-full grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-brand-primary-lightest rounded-full text-sm text-brand-primary font-medium shadow-sm">
              #1 TRUSTED VTU PLATFORM
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-text-primary leading-tight tracking-tight">
              All Your VTU Needs,<br />
              <span className="relative inline-block">
                one platform
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 8C50 2 100 2 150 6C200 10 250 4 295 8"
                    stroke="#1812AE"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-[draw-curve_1.5s_ease-out_0.5s_forwards]"
                    style={{ strokeDasharray: '300', strokeDashoffset: '300' }}
                  />
                </svg>
              </span><br />
              with <span className="text-brand-primary font-bold">Terrabyte</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-text-secondary max-w-md">
              Buy data, pay bills, top-up airtime, or handle payments securely — all from one fast and trusted platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup" className="flex-1 bg-brand-primary text-white text-sm font-semibold py-3 rounded-full hover:bg-brand-primary-dark transition-all duration-300 text-center">
                Get Started
              </Link>
              <Link to="/login" className="flex-1 border border-brand-primary text-brand-primary text-sm font-semibold py-3 rounded-full hover:bg-brand-primary-lightest transition-all duration-300 text-center">
                Sign In
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition duration-300">
                <Twitter className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition duration-300">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition duration-300">
                <Facebook className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE MOCKUP */}
          <div className="relative hidden lg:flex justify-center items-center w-full h-full">
            <img
              src="/img/terrabyte2.png"
              alt="Terrabyte Preview"
              className="max-w-sm lg:max-w-md h-[400px] sm:h-[480px] lg:h-[520px] object-cover rounded-xl"
            />

            {/* Floating Icons */}
            <div className="absolute -top-6 -right-5  rounded-2xl p-3 animate-float">
             <img src="/img/bolt.png" alt="fast" className="w-40 h-40" />
            </div>
            <div
              className="absolute -bottom-1 -left-0  rounded-2xl p-3 animate-float"
              style={{ animationDelay: '1s' }}
            >
              <img src="/img/earth.png" alt="fast" className="w-12 h-12" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
