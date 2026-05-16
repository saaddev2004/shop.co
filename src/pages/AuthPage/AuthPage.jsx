import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiArrowRight, FiGithub, FiTwitter } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../../Context/UserContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login, signup, currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/profile");
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const res = login(formData.email, formData.password);
      if (!res.success) setError(res.message);
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required");
        return;
      }
      const res = signup(formData.name, formData.email, formData.password);
      if (!res.success) setError(res.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4 py-20 transition-colors duration-500">
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-neutral-900 rounded-[40px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/5">
        
        {/* Left Side: Visual/Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-extrabold tracking-tight font-heading mb-12 block">
              SHOP.CO
            </Link>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Elevate Your <br /> Shopping <br /> Experience.
            </h1>
            <p className="text-white/60 text-lg max-w-[380px]">
              Join our community of over 10 million fashion enthusiasts worldwide.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-white/80">
              Trusted by 10M+ users
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold dark:text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-black/60 dark:text-white/60">
              {isLogin 
                ? "Please enter your details to sign in" 
                : "Sign up to start your fashion journey"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              onSubmit={handleSubmit}
              key={isLogin ? "login" : "signup"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 px-4 py-3 rounded-xl text-sm font-bold text-center border border-red-500/20">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-2xl px-12 py-4 outline-none transition-all dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              )}

              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-2xl px-12 py-4 outline-none transition-all dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-2xl px-12 py-4 outline-none transition-all dark:text-white"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button className="text-sm font-bold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-4">
                {isLogin ? "Sign In" : "Create Account"} <FiArrowRight />
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-10">
            <div className="relative flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-black/5 dark:bg-white/5" />
              <span className="text-xs font-bold text-black/30 dark:text-white/30 uppercase tracking-widest">Or continue with</span>
              <div className="flex-1 h-[1px] bg-black/5 dark:bg-white/5" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button className="flex items-center justify-center p-4 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <FcGoogle size={24} />
              </button>
              <button className="flex items-center justify-center p-4 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <FiGithub size={24} className="dark:text-white" />
              </button>
              <button className="flex items-center justify-center p-4 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <FiTwitter size={24} className="text-[#1DA1F2]" />
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-black/60 dark:text-white/60">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); setFormData({ name: "", email: "", password: "" }); }}
              className="font-bold text-black dark:text-white hover:underline transition-all"
            >
              {isLogin ? "Sign Up Free" : "Sign In Now"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
