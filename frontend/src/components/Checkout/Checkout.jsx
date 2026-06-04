import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"; 
import { CartContext } from "../../Context/CartContext";
import { useOrders } from "../../Context/OrderContext";
import { useUser } from "../../Context/UserContext";
import { useProducts } from "../../Context/ProductContext";
import { FaCreditCard, FaMoneyBillWave, FaLock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaChevronRight } from "react-icons/fa";

const Checkout = () => {
  const { items, clearCart } = useContext(CartContext);
  const { addOrder } = useOrders();
  const { currentUser } = useUser();
  const { products } = useProducts();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    name: currentUser ? currentUser.name : "",
    email: currentUser ? currentUser.email : "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD", // "COD" or "Card"
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    cardName: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || currentUser.name,
        email: prev.email || currentUser.email
      }));
    }
  }, [currentUser]);

  // Helper to get image for product thumbnail in checkout summary
  const getItemImage = (item) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";
    
    if (product.allImages && item.selectedColor) {
        const colorImg = product.allImages.find(img => 
            typeof img === 'object' ? img.color === item.selectedColor : false
        );
        if (colorImg) return colorImg.url;
    }
    return product.image || "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      // Keep only numbers and limit to 16 digits, format with space
      const raw = value.replace(/\D/g, "").slice(0, 16);
      const parts = raw.match(/.{1,4}/g) || [];
      formattedValue = parts.join(" ");
    } else if (name === "cardExpiry") {
      // MM/YY format
      const raw = value.replace(/\D/g, "").slice(0, 4);
      if (raw.length > 2) {
        formattedValue = `${raw.slice(0, 2)}/${raw.slice(2)}`;
      } else {
        formattedValue = raw;
      }
    } else if (name === "cardCVV") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    } else if (name === "phone") {
      formattedValue = value.replace(/[^\d+-\s]/g, ""); // allow basic phone chars
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, "").length < 7) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Shipping address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    if (formData.paymentMethod === "Card") {
      const rawCard = formData.cardNumber.replace(/\s/g, "");
      if (rawCard.length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }
      if (!formData.cardExpiry.includes("/") || formData.cardExpiry.length !== 5) {
        newErrors.cardExpiry = "Expiry date must be MM/YY";
      } else {
        const [mm, yy] = formData.cardExpiry.split("/");
        const month = parseInt(mm, 10);
        if (month < 1 || month > 12) {
          newErrors.cardExpiry = "Invalid month";
        }
      }
      if (formData.cardCVV.length !== 3) {
        newErrors.cardCVV = "CVV must be 3 digits";
      }
      if (!formData.cardName.trim()) {
        newErrors.cardName = "Cardholder name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const discount = subtotal * 0.2; // 20% Discount
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!validateForm()) return;

    const orderData = {
      customer: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      paymentMethod: formData.paymentMethod,
      cart: items,
      total: total,
    };

    const newOrder = addOrder(orderData);
    setPlacedOrderDetails(newOrder);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex flex-col lg:flex-row items-center justify-between container mx-auto px-4 py-12 gap-12 transition-colors duration-500">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold mb-4 inline-block">
            Order Placed Successfully!
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-6 font-heading dark:text-white leading-[1.1] tracking-tight">
            THANK YOU FOR <br className="hidden md:block" /> YOUR PURCHASE
          </h1>
          <div className="bg-gray-50 dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-2xl p-6 mb-8 w-full max-w-[500px]">
            <h3 className="font-bold text-lg mb-4 dark:text-white border-b border-black/5 dark:border-white/5 pb-2">Order Summary</h3>
            <div className="space-y-2 text-sm text-black/75 dark:text-white/75">
              <p><span className="font-semibold text-black dark:text-white">Order ID:</span> {placedOrderDetails?.id}</p>
              <p><span className="font-semibold text-black dark:text-white">Recipient Name:</span> {placedOrderDetails?.customer}</p>
              <p><span className="font-semibold text-black dark:text-white">Shipping Address:</span> {placedOrderDetails?.address}</p>
              <p><span className="font-semibold text-black dark:text-white">Payment Method:</span> {placedOrderDetails?.paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Paid via Credit/Debit Card"}</p>
              <p className="border-t border-black/5 dark:border-white/5 pt-2 mt-2 font-bold text-black dark:text-white text-base">
                Total: Rs. {placedOrderDetails?.total?.toLocaleString()}
              </p>
            </div>
          </div>
          <Link 
            to="/" 
            className="bg-black text-white dark:bg-white dark:text-black px-12 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity transform active:scale-95 shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="relative group grayscale hover:grayscale-0 transition-all duration-75">
            <img
              src="/assets/confirmation.png"
              alt="Order Confirmed"
              onError={(e) => {
                // If asset is missing, hide or show fallback checkmark
                e.target.style.display = 'none';
              }}
              className="w-full max-w-[450px] h-auto object-contain transition-all duration-700 group-hover:scale-105"
            />
            {/* Fallback Checkmark Icon if image not found */}
            <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 text-7xl font-light mx-auto">
              ✓
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 transition-colors duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Home</Link> 
        <span className="text-black/60 dark:text-white/60">/</span>
        <Link to="/add-to-cart-page" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Cart</Link>
        <span className="text-black/60 dark:text-white/60">/</span> 
        <span className="font-bold dark:text-white">Checkout</span>
      </nav>

      <h1 className="text-2xl md:text-4xl font-extrabold mb-8 font-heading dark:text-white tracking-tight">
        CHECKOUT
      </h1>

      {items.length === 0 ? (
        <div className="border border-black/10 dark:border-white/10 rounded-[20px] p-12 bg-white dark:bg-neutral-900 text-center flex flex-col items-center gap-4">
          <p className="text-black/60 dark:text-white/60 text-lg font-medium">Your cart is empty. Add items to checkout.</p>
          <Link to="/" className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-bold">Go back to Shop</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Billing & Shipping Forms */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="border border-black/10 dark:border-white/10 rounded-[20px] p-6 md:p-8 bg-white dark:bg-neutral-900 flex flex-col gap-6">
              
              <div>
                <h2 className="text-xl font-bold dark:text-white mb-1 flex items-center gap-2">
                  <FaUser className="text-black/40 dark:text-white/40" size={16} /> Customer Information
                </h2>
                <p className="text-xs text-black/50 dark:text-white/50 mb-4">Provide details for order communication and receipt.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-black/60 dark:text-white/60">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Saad Ali"
                      className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm dark:text-white border ${errors.name ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                    />
                    {errors.name && <span className="text-[11px] text-red-500 font-semibold">{errors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-black/60 dark:text-white/60">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="e.g. customer@domain.com"
                      className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm dark:text-white border ${errors.email ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                    />
                    {errors.email && <span className="text-[11px] text-red-500 font-semibold">{errors.email}</span>}
                  </div>
                </div>
              </div>

              <hr className="border-black/10 dark:border-white/10" />

              <div>
                <h2 className="text-xl font-bold dark:text-white mb-1 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-black/40 dark:text-white/40" size={16} /> Shipping Details
                </h2>
                <p className="text-xs text-black/50 dark:text-white/50 mb-4">Tell us where to ship your purchase.</p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-black/60 dark:text-white/60">Street Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      placeholder="House No, Street, Apartment, Landmark"
                      className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm dark:text-white border ${errors.address ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                    />
                    {errors.address && <span className="text-[11px] text-red-500 font-semibold">{errors.address}</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-black/60 dark:text-white/60">City</label>
                      <input 
                        type="text" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Lahore"
                        className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm dark:text-white border ${errors.city ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                      />
                      {errors.city && <span className="text-[11px] text-red-500 font-semibold">{errors.city}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-black/60 dark:text-white/60">Phone Number</label>
                      <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="e.g. 03001234567"
                        className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm dark:text-white border ${errors.phone ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                      />
                      {errors.phone && <span className="text-[11px] text-red-500 font-semibold">{errors.phone}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-black/10 dark:border-white/10" />

              {/* Payment Methods */}
              <div>
                <h2 className="text-xl font-bold dark:text-white mb-1 flex items-center gap-2">
                  <FaCreditCard className="text-black/40 dark:text-white/40" size={16} /> Payment Method
                </h2>
                <p className="text-xs text-black/50 dark:text-white/50 mb-4">Choose how you wish to pay.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* COD */}
                  <label 
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "COD" }))}
                    className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${formData.paymentMethod === "COD" ? "border-black bg-black/5 dark:border-white dark:bg-white/5" : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"}`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={formData.paymentMethod === "COD"} 
                      onChange={() => {}} 
                      className="mt-1 accent-black dark:accent-white"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-emerald-500" size={16} />
                        <span className="font-bold text-sm dark:text-white">Cash On Delivery</span>
                      </div>
                      <p className="text-[11px] text-black/60 dark:text-white/60 mt-1">Pay when your products arrive.</p>
                    </div>
                  </label>

                  {/* Card */}
                  <label 
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "Card" }))}
                    className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${formData.paymentMethod === "Card" ? "border-black bg-black/5 dark:border-white dark:bg-white/5" : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"}`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Card" 
                      checked={formData.paymentMethod === "Card"} 
                      onChange={() => {}} 
                      className="mt-1 accent-black dark:accent-white"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FaCreditCard className="text-blue-500" size={16} />
                        <span className="font-bold text-sm dark:text-white">Credit / Debit Card</span>
                      </div>
                      <p className="text-[11px] text-black/60 dark:text-white/60 mt-1">Instant, secure card payment.</p>
                    </div>
                  </label>
                </div>

                {/* Card Fields Form Wrapper */}
                {formData.paymentMethod === "Card" && (
                  <div className="bg-[#FBFBFB] dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-2xl p-5 flex flex-col gap-4 animate-fadeIn">
                    
                    {/* Premium Credit Card Mockup Preview */}
                    <div className="w-full max-w-[340px] aspect-[1.58/1] mx-auto bg-gradient-to-br from-neutral-800 to-black text-white rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between mb-4 border border-white/10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-7 bg-amber-400/80 rounded-md shadow-inner" /> {/* Chip */}
                        <FaCreditCard size={28} className="text-white/60" />
                      </div>
                      
                      <div className="text-lg md:text-xl font-mono tracking-widest my-4">
                        {formData.cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-white/50">Cardholder</p>
                          <p className="text-xs font-mono font-semibold tracking-wider truncate max-w-[150px] uppercase">
                            {formData.cardName || "YOUR NAME"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-widest text-white/50">Expires</p>
                          <p className="text-xs font-mono font-semibold">
                            {formData.cardExpiry || "MM/YY"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-black/60 dark:text-white/60">Cardholder Name</label>
                      <input 
                        type="text" 
                        name="cardName" 
                        value={formData.cardName} 
                        onChange={handleInputChange} 
                        placeholder="NAME ON CARD"
                        className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm dark:text-white uppercase border ${errors.cardName ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                      />
                      {errors.cardName && <span className="text-[11px] text-red-500 font-semibold">{errors.cardName}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-black/60 dark:text-white/60">Card Number</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          name="cardNumber" 
                          value={formData.cardNumber} 
                          onChange={handleInputChange} 
                          placeholder="4111 2222 3333 4444"
                          className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl pl-10 pr-4 py-3 outline-none text-sm dark:text-white border ${errors.cardNumber ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                        />
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 text-xs" />
                      </div>
                      {errors.cardNumber && <span className="text-[11px] text-red-500 font-semibold">{errors.cardNumber}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-black/60 dark:text-white/60">Expiry Date</label>
                        <input 
                          type="text" 
                          name="cardExpiry" 
                          value={formData.cardExpiry} 
                          onChange={handleInputChange} 
                          placeholder="MM/YY"
                          className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm dark:text-white text-center border ${errors.cardExpiry ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                        />
                        {errors.cardExpiry && <span className="text-[11px] text-red-500 font-semibold">{errors.cardExpiry}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-black/60 dark:text-white/60">CVV / CVV2</label>
                        <input 
                          type="password" 
                          name="cardCVV" 
                          value={formData.cardCVV} 
                          onChange={handleInputChange} 
                          placeholder="•••"
                          className={`w-full bg-[#F0F0F0] dark:bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm dark:text-white text-center border ${errors.cardCVV ? 'border-red-500' : 'border-transparent focus:border-black/20'}`}
                        />
                        {errors.cardCVV && <span className="text-[11px] text-red-500 font-semibold">{errors.cardCVV}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right: Checkout Order Summary Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="border border-black/10 dark:border-white/10 rounded-[20px] p-6 lg:p-8 bg-white dark:bg-neutral-900 flex flex-col gap-6">
              <h2 className="text-xl font-bold dark:text-white border-b border-black/5 dark:border-white/5 pb-4">
                Order Review ({items.reduce((acc, it) => acc + it.quantity, 0)})
              </h2>
              
              {/* Product list loop */}
              <div className="max-h-[250px] overflow-y-auto pr-1 space-y-4 divide-y divide-black/5 dark:divide-white/5">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pt-4 first:pt-0 items-center">
                    <div className="w-16 h-16 bg-[#F0EEED] dark:bg-neutral-800 rounded-xl p-1 shrink-0 flex items-center justify-center">
                      <img 
                        src={getItemImage(item)} 
                        alt={item.name} 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm dark:text-white truncate">{item.name}</h4>
                      <p className="text-xs text-black/50 dark:text-white/50">
                        Size: {item.selectedSize} | Color: <span className="inline-block w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor }} />
                      </p>
                      <p className="text-xs font-bold dark:text-white/80 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-sm dark:text-white">Rs. {item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-black/10 dark:border-white/10" />

              {/* Price Calculations */}
              <div className="flex flex-col gap-3 text-sm text-black/60 dark:text-white/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-black dark:text-white">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount (20%)</span>
                  <span className="font-bold text-red-500">-Rs. {discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-black dark:text-white">Rs. {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base md:text-lg font-bold border-t border-black/5 dark:border-white/5 pt-4 mt-2">
                  <span className="text-black dark:text-white">Grand Total</span>
                  <span className="text-black dark:text-white">Rs. {total}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-black text-white dark:bg-white dark:text-black py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity transform active:scale-95 shadow-lg mt-2"
              >
                {formData.paymentMethod === "COD" ? "Place Order (COD)" : "Pay & Place Order"}
                <FaChevronRight size={12} />
              </button>
              
              <div className="flex justify-center items-center gap-2 text-[11px] text-black/40 dark:text-white/40">
                <FaLock />
                <span>100% Encrypted & Secure Checkout process</span>
              </div>

            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
