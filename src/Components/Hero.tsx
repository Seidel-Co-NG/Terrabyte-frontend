import { Facebook, Instagram, Twitter } from 'lucide-react';
import TerrabyteImage from '../assets/terrabyte2.png'



export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-white to-gray-50">
      <div className="flex lg:items-center py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-900 font-medium shadow-sm">
              #1 TRUSTED DATA PLATFORM
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              All Your Data Needs,<br />
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
                    stroke="#1e3a8a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-[draw-curve_1.5s_ease-out_0.5s_forwards]"
                    style={{ strokeDasharray: '300', strokeDashoffset: '300' }}
                  />
                </svg>
              </span><br />
              with <span className="text-blue-900 font-bold">Terrabyte</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-md">
              Buy data, pay bills, top-up airtime, or handle payments securely — all from one fast and trusted platform.
            </p>

            {/* CTA Input */}
            <div className="flex items-center max-w-md w-full rounded-full border border-black bg-white/5 backdrop-blur-lg shadow-md overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-[60%] px-4 py-3 text-sm text-black placeholder-gray-400 bg-transparent outline-none"
              />
              <button className="w-[40%] bg-blue-900 text-white text-sm font-semibold py-3 rounded-full hover:bg-blue-800 transition-all duration-300">
                Get Started
              </button>
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
          <div className="relative hidden sm:flex justify-center items-center w-full h-full">
            <img
              src={TerrabyteImage}
              alt="Terrabyte Preview"
              className=" max-w-sm h-[520px] object-cover rounded-xl"
            />

            {/* Floating Icons */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-md p-3 animate-float">
              <div className="text-2xl">💳</div>
              <div className="text-xs font-medium text-gray-700 text-center">Fast Payment</div>
            </div>
            <div
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-md p-3 animate-float"
              style={{ animationDelay: '1s' }}
            >
              <div className="text-2xl">📱</div>
              <div className="text-xs font-medium text-gray-700 text-center">Mobile Access</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
