import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppData } from "../context/ContextProvider";
import ProfileButton from "./ProfileButton";

const links = [
  { name: "Products", link: "/products" },
  { name: "About", link: "about" },
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
    <nav className="w-full border-b border-white/10 bg-slate-950/70 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white transition-opacity hover:opacity-80 md:text-3xl">
              Bid<span className="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">IT</span>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {links.map((link, index) => (
              <Link
                key={index}
                to={`${link.link}`}
                className="relative text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-orange-300"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {user ? (
              <ProfileButton name={user?.name} email={user?.email} />
            ) : (
              <button
                onClick={handleClick}
                className="hidden rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-6 py-2 font-semibold text-slate-950 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 md:inline-block"
              >
                Get Start
              </button>
            )}

            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 transition-colors hover:bg-orange-500/15 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/10 pb-4 md:hidden">
            <div className="flex flex-col gap-3 pt-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={`${link.link}`}
                  className="rounded-lg px-4 py-2 font-medium text-slate-300 transition-colors hover:bg-orange-500/15"
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
                  className="mx-4 rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-6 py-2 font-semibold text-slate-950"
                >
                  Get Start
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        :global(.animate-slide-down) {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
