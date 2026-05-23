import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser, FiArrowRight, FiGithub, FiTwitter } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const AuthForm = ({ 
    isLogin, 
    setIsLogin, 
    formData, 
    setFormData, 
    error, 
    setError, 
    handleSubmit,
    containerVariants
}) => {
    return (
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
                    <button type="button" className="text-sm font-bold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
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
    );
};

export default AuthForm;
