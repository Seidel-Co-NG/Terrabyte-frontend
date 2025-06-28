import Logo from '../assets/logo2.png'

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo */}
           <div>
        <img
          src={Logo}
          alt="Terrabyte Logo"
          className="w-20 "
        />
      </div>

      {/* Nav Links */}
      <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
        <li><a href="#home" className="hover:text-blue-600">Home</a></li>
        <li><a href="#features" className="hover:text-blue-600">Features</a></li>
        <li><a href="#about" className="hover:text-blue-600">About Us</a></li>
        <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
      </ul>

      {/* Auth Buttons */}
      <div className="flex gap-3">
        <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50">
          Sign in
        </button>
        <button className="px-6 py-2 bg-blue-900 text-white rounded-full text-sm font-medium hover:bg-blue-700">
          Sign up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
