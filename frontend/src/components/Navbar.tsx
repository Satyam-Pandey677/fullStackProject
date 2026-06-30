import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppData } from "../context/ContextProvider";
import ProfileButton from "./ProfileButton";

const links = [
  {
    name: "Product",
    link: "/products",
  },
  {
    name: "About",
    link: "about",
  },
  {
    name: "Guide",
    link: "guide",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAppData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = () => {
    navigate("/sign-in");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-linear-to-r from-white via-white to-orange-50 shadow-lg border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl md:text-3xl font-bold hover:opacity-80 transition-opacity">
              Bid<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">IT</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8 items-center flex-1 justify-center">
            {links.map((link, index) => (
              <Link
                key={index}
                to={`${link.link}`}
                className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Side - Auth/Profile */}
          <div className="flex items-center gap-4 md:gap-6">
            {user ? (
              <ProfileButton name={user?.name} email={user?.email} />
            ) : (
              <button
                onClick={handleClick}
                className="hidden md:inline-block px-6 py-2 bg-linear-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-400/50 transition-all duration-300 transform hover:scale-105"
              >
                Get Start
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-orange-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-orange-100 animate-slide-down">
            <div className="flex flex-col gap-3 pt-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={`${link.link}`}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-orange-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    handleClick();
                    setIsMenuOpen(false);
                  }}
                  className="mx-4 px-6 py-2 bg-linear-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Get Start
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style tsx="true">{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        :global(.animate-slide-down) {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
