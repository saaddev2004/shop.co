import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { CartContext } from "../../Context/CartContext";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiChevronDown, FiUser } from "react-icons/fi";
import { useProducts } from "../../Context/ProductContext";
import { categories } from "../../data/products";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const { products } = useProducts();

  const { totalQty } = useContext(CartContext);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchInput.trim()) {
        setIsSearchOpen(false);
        navigate("/shop", { state: { searchQuery: searchInput.trim() } });
        setSearchInput(""); // Clear input after search
      }
    }
  };

  useEffect(() => {
    // Ensure dark mode is disabled
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("darkMode");
  }, []);

  const navLinks = [
    { name: "Shop By Category", hash: "/shop", isDropdown: true },
    { name: "New Arrivals", hash: "/#New-Arrivals" },
    { name: "End Of Season Sale", text: "End Of Season Sale-Upto 50% OFF", hash: "/shop", filterSale: true, isHighlight: true },
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
          <div className="flex-1 flex justify-center lg:justify-start">
            <Link to="/" className="text-2xl lg:text-3xl font-extrabold tracking-tight font-heading">
              SHOP.CO
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
            {navLinks.map((link) => (
              link.isDropdown ? (
                <div key={link.name} className="relative group py-2 flex items-center">
                  <Link
                    to={link.hash}
                    className="relative flex items-center gap-1 text-[15px] font-normal hover:text-gray-600 transition-colors dark:text-white dark:hover:text-gray-300 whitespace-nowrap pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
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
                  state={{ filterSale: link.filterSale }}
                  className="relative text-[15px] font-medium text-red-500 hover:text-red-600 transition-colors py-2 flex items-center whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.text}
                </Link>
              ) : (
                <HashLink
                  key={link.name}
                  smooth
                  to={link.hash}
                  className="relative text-[15px] font-normal hover:text-gray-600 transition-colors dark:text-white dark:hover:text-gray-300 py-2 flex items-center whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
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
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div
          className={`absolute bottom-0 left-0 w-full h-[85vh] bg-white dark:bg-neutral-900 px-5 py-8 pt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform rounded-t-[40px] flex flex-col ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Handle */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight font-heading dark:text-white">SHOP.CO</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-2xl dark:text-white"><FiX /></button>
          </div>

          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col">
                {link.isDropdown ? (
                  <>
                    <button
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center justify-between text-base font-semibold border-b border-gray-100 dark:border-white/10 pb-2 dark:text-white w-full text-left"
                    >
                      {link.name}
                      <FiChevronDown className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCategoryOpen && (
                      <div className="flex flex-col gap-3 pl-3 mt-3 animate-in slide-in-from-top-2 duration-300">
                        {categories.filter(c => c !== "All").map((cat, idx) => (
                          <Link
                            key={idx}
                            to="/shop"
                            state={{ category: cat }}
                            className="text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <HashLink
                    smooth
                    to={link.hash}
                    className="text-base font-semibold border-b border-gray-100 dark:border-white/10 pb-2 dark:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.isHighlight ? link.text : link.name}
                  </HashLink>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-10 flex justify-start">
            <Link
              to="/profile"
              className="flex items-center justify-center gap-3 w-fit px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium transition-transform active:scale-95 shadow-lg mb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiUser className="text-xl" /> My account
            </Link>
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
              value={searchInput}
              onChange={(e) => {
                const query = e.target.value;
                setSearchInput(query);
                if (query.trim().length > 1) {
                  const filtered = products.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase())
                  ).slice(0, 6);
                  setSuggestions(filtered);
                } else {
                  setSuggestions([]);
                }
              }}
              onKeyDown={handleSearch}
            />
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 text-lg cursor-pointer"
              onClick={handleSearch}
            />
          </div>

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4 bg-white dark:bg-neutral-800 rounded-xl border border-black/5 dark:border-white/10 overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="px-4 py-2 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider bg-black/5 dark:bg-white/5">Suggestions</p>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  className="w-full px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-3 transition-colors border-b border-black/5 last:border-0"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSuggestions([]);
                    setSearchInput("");
                    navigate(product.link);
                  }}
                >
                  <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-700 rounded-lg overflow-hidden flex-none p-1">
                    <img src={product.image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold dark:text-white line-clamp-1">{product.name}</span>
                    <span className="text-[10px] text-black/40 dark:text-white/40 uppercase">{product.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

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
