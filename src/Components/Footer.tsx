import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
       <footer className="bg-black text-white pt-16 pb-10 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-12">
        {/* Call to Action */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">
            Do more with TERRABYTE 🚀
          </h3>
          <p className="text-sm text-blue-100 leading-relaxed max-w-md">
            Don’t waste another minute. <br />
            <strong>Create an account</strong> now and start making more transactions with ease.
            Enjoy secure, fast, and convenient service — all in one device.
          </p>
          <button className="mt-5 bg-white text-blue-900 font-semibold px-6 py-2 rounded-full hover:bg-blue-100 transition">
            Get Started
          </button>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Useful Links</h4>
          <ul className="space-y-2 text-sm text-blue-100">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Our Services</h4>
          <ul className="space-y-2 text-sm text-blue-100">
            <li><a href="/buy-data" className="hover:text-white">Buy Data</a></li>
            <li><a href="/airtime" className="hover:text-white">Airtime TopUp</a></li>
            <li><a href="/bulk-sms" className="hover:text-white">Bulk SMS</a></li>
            <li><a href="/cable" className="hover:text-white">Cable Subscription</a></li>
            <li><a href="/utility" className="hover:text-white">Utility Bills</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-blue-800 mt-16 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-blue-100 text-center">
          © {new Date().getFullYear()} <strong>TERRABYTE</strong>. All Rights Reserved.
        </p>
        <p className="text-xs text-blue-100 text-center">
          {/* Developed by <a href="https://" className="underline hover:text-white">Pheebz-Dev Technology</a> */}
        </p>

        {/* Socials */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white"><Facebook size={18} /></a>
          <a href="#" className="hover:text-white"><Twitter size={18} /></a>
          <a href="#" className="hover:text-white"><Instagram size={18} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
