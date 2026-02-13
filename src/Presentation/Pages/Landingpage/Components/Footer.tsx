import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 sm:pt-16 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
        {/* Call to Action */}
        <div className="sm:col-span-2">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Do more with TERRABYTE 🚀
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md">
            Don't waste another minute. <br />
            <strong>Create an account</strong> now and start making more transactions with ease.
            Enjoy secure, fast, and convenient service — all in one device.
          </p>
          <Link to="/login" >
          <button className="mt-4 sm:mt-5 bg-white text-brand-primary font-semibold px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full hover:bg-gray-100 transition">

            Get Started
            </button>
          </Link>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Useful Links</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="/terms & privacy-policy" className="hover:text-white transition-colors">Terms & Privacy</a></li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Our Services</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
            <li><a href="/buy-data" className="hover:text-white transition-colors">Buy Data</a></li>
            <li><a href="/airtime" className="hover:text-white transition-colors">Airtime TopUp</a></li>
            <li><a href="/bulk-sms" className="hover:text-white transition-colors">Bulk SMS</a></li>
            <li><a href="/cable" className="hover:text-white transition-colors">Cable Subscription</a></li>
            <li><a href="/utility" className="hover:text-white transition-colors">Utility Bills</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-screen-2xl mx-auto">
        <div className="border-t border-gray-800 mt-12 sm:mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-300 text-center">
            © {new Date().getFullYear()} <strong>TERRABYTE</strong>. All Rights Reserved.
          </p>
          <p className="text-xs text-gray-300 text-center">
            Distributed by <a href="https://seidelco.com.ng" className="underline hover:text-white">SEIDEL-CO</a>
          </p>

          {/* Socials */}
          <div className="flex space-x-3 sm:space-x-4">
            <a href="#" className="hover:text-white transition-colors"><Facebook className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
