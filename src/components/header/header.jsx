import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { CartContext } from "../../Context/CartContext";
import { FiShoppingCart, FiSearch, FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiUser } from "react-icons/fi";
import { categories } from "../../data/products";

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { totalQty } = useContext(CartContext);

  const handleSearch = (e) => e.preventDefault();

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const navLinks = [
    { name: "Shop By Category", hash: "/shop", isDropdown: true },
    { name: "New Arrivals", hash: "/#New-Arrivals" },
    { name: "End Of Season Sale", text: "End Of Season Sale-Upto 50% OFF", hash: "/shop", isHighlight: true },
  ];

  return (
    <>
    <header className="sticky top-0 z-40 w-full glass dark:bg-black/80 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        
        {/* Mobile Left: Menu Toggle */}
        <div className="flex-1 flex justify-start lg:hidden">
          <button 
            className="text-2xl"
            onClick={() => setIsMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>

        {/* Center/Left: Logo */}
        <div className="flex-none">
          <Link to="/" className="text-2xl lg:text-3xl font-extrabold tracking-tight font-heading">
            SHOP.CO
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
          {navLinks.map((link) => (
            link.isDropdown ? (
              <div key={link.name} className="relative group py-2">
                <Link 
                  to={link.hash} 
                  className="flex items-center gap-1 text-[15px] font-normal hover:text-gray-600 transition-colors dark:text-white dark:hover:text-gray-300"
                >
                  {link.name} <FiChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full pt-1 left-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-black/5 dark:border-white/10 py-2 flex flex-col">
                    {categories.filter(c => c !== "All").map((cat, idx) => (
                      <Link 
                        key={idx}
                        to="/shop"
                        state={{ category: cat }}
                        className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 dark:text-white text-sm font-normal transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : link.isHighlight ? (
              <Link 
                key={link.name}
                to={link.hash} 
                className="text-[15px] font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                {link.text}
              </Link>
            ) : (
              <HashLink 
                key={link.name}
                smooth 
                to={link.hash} 
                className="text-[15px] font-normal hover:text-gray-600 transition-colors dark:text-white dark:hover:text-gray-300"
              >
                {link.name}
              </HashLink>
            )
          ))}
        </nav>

        {/* Actions */}
        <div className="flex-1 flex items-center justify-end gap-4 lg:gap-5">
          <button 
            className="text-[22px] hover:scale-110 transition-transform dark:text-white" 
            onClick={() => setIsSearchOpen(true)}
          >
            <FiSearch />
          </button>

          <Link to="/profile" className="hidden lg:block text-[22px] hover:scale-110 transition-transform dark:text-white">
            <FiUser />
          </Link>

          <Link to="/add-to-cart-page" className="relative group p-2">
            <FiShoppingCart className="text-[22px] group-hover:scale-110 transition-transform dark:text-white" />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 bg-black dark:bg-white dark:text-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black animate-in fade-in zoom-in duration-300">
                {totalQty}
              </span>
            )}
          </Link>

          <button 
            onClick={toggleDarkMode}
            className="hidden lg:block p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {darkMode ? <FiSun className="text-white text-xl" /> : <FiMoon className="text-xl" />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Sidebar Navigation */}
      <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={`absolute left-0 top-0 h-full w-[280px] bg-white dark:bg-black p-6 shadow-xl transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight font-heading">SHOP.CO</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-2xl"><FiX /></button>
          </div>
          
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <HashLink 
                key={link.name}
                smooth 
                to={link.hash} 
                className="text-lg font-normal border-b border-gray-100 dark:border-white/10 pb-2 dark:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </HashLink>
            ))}
          </nav>

          <div className="flex flex-col gap-6 mt-6 border-t border-gray-100 dark:border-white/10 pt-6">
            <button className="flex items-center gap-3 text-lg font-normal dark:text-white" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}>
              <FiSearch className="text-2xl" /> Search
            </button>
            <Link to="/profile" className="flex items-center gap-3 text-lg font-normal dark:text-white" onClick={() => setIsMenuOpen(false)}>
              <FiUser className="text-2xl" /> Profile
            </Link>
            <Link to="/add-to-cart-page" className="flex items-center gap-3 text-lg font-normal dark:text-white" onClick={() => setIsMenuOpen(false)}>
              <div className="relative">
                <FiShoppingCart className="text-2xl" />
                {totalQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black dark:bg-white dark:text-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                    {totalQty}
                  </span>
                )}
              </div>
              <span className="ml-1">Cart</span>
            </Link>
          </div>

          <div className="mt-auto pt-8">
            <button 
               onClick={() => {
                toggleDarkMode();
                setIsMenuOpen(false);
               }}
               className="w-full flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black py-4 rounded-2xl font-bold transition-transform active:scale-95"
            >
              {darkMode ? <><FiSun /> Light Mode</> : <><FiMoon /> Dark Mode</>}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Search Sidebar (Right Side) */}
      <div 
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSearchOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-full sm:w-[350px] bg-white dark:bg-neutral-900 p-6 shadow-2xl transition-transform duration-500 transform ${isSearchOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight font-heading dark:text-white">Search</h2>
            <button onClick={() => setIsSearchOpen(false)} className="text-2xl text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors">
              <FiX />
            </button>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="w-full bg-[#f0f0f0] dark:bg-neutral-800 text-black dark:text-white rounded-xl px-5 py-4 pl-12 outline-none border border-transparent focus:border-black/20 dark:focus:border-white/20 transition-all font-normal"
              autoFocus={isSearchOpen}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 text-lg" />
          </div>

          <div className="mt-8 border-t border-black/5 dark:border-white/5 pt-6">
            <p className="text-sm font-medium text-black/40 dark:text-white/40 mb-4 uppercase">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Denim Jackets', 'Graphic T-Shirts', 'Skinny Jeans'].map((tag) => (
                <button key={tag} className="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full text-sm font-normal hover:bg-black/10 dark:hover:bg-white/10 transition-colors dark:text-white">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
