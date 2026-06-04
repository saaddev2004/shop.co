import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/admin");
    } else {
      setError("Invalid administrative credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F8F8] dark:bg-black relative overflow-hidden transition-colors duration-500">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.06)] dark:shadow-none p-8 md:p-12 border border-black/[0.05] dark:border-white/[0.05] relative z-10">
          
          <div className="text-center mb-12">
            <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-block px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
            >
                Administrative Access
            </motion.div>
            <h1 className="text-4xl font-extrabold tracking-tighter font-heading dark:text-white mb-3">SHOP.CO</h1>
            <p className="text-black/40 dark:text-white/40 text-sm font-medium">Enter your credentials to manage the portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest ml-1 text-black/50 dark:text-white/50">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent focus:border-black/5 dark:focus:border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all dark:text-white font-medium placeholder:text-black/20 dark:placeholder:text-white/20"
                  placeholder="admin@shop.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest ml-1 text-black/50 dark:text-white/50">Secure Password</label>
              <div className="relative group">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent focus:border-black/5 dark:focus:border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all dark:text-white font-medium placeholder:text-black/20 dark:placeholder:text-white/20"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-900/10 text-red-500 text-xs font-bold py-3 rounded-xl text-center border border-red-100 dark:border-red-900/20"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              className="group w-full bg-black dark:bg-white text-white dark:text-black font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mt-8"
            >
              Secure Sign In <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Support Links */}
        <div className="flex justify-center gap-8 mt-10">
            <button className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors">Forgot Password?</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors">Security Guidelines</button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
