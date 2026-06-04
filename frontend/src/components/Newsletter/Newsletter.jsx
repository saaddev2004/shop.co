import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    // Simulate API call to email provider
    setTimeout(() => {
      // Simulate error if email contains "test"
      if (email.toLowerCase().includes("test")) {
        setStatus("error");
        setMessage("This email is already subscribed.");
      } else {
        setStatus("success");
        setMessage("Welcome to the VIP club! Check your inbox.");
        setEmail("");
      }
      
      // Reset state after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }, 1500);
  };

  return (
    <section className="px-4 relative -mb-28 z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto relative overflow-hidden rounded-[40px] p-8 md:p-14 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-black/10 dark:shadow-white/5"
      >
        {/* Deep, rich animated background */}
        <div className="absolute inset-0 bg-black dark:bg-neutral-950 z-0" />
        
        {/* Soft elegant glowing spheres */}
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-[100px] z-0" />
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />

        <div className="relative z-10 w-full lg:w-1/2 text-center lg:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] font-heading mb-4 text-white tracking-tight"
          >
            Stay ahead with our <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">exclusive offers.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/60 font-medium text-sm md:text-base max-w-md mx-auto lg:mx-0"
          >
            Join our private mailing list for early access to drops, tailored styling advice, and VIP-only discounts.
          </motion.p>
        </div>

        <motion.form 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 flex flex-col gap-4 w-full max-w-[400px]"
          onSubmit={handleSubmit}
        >
          <div className="relative group">
            <FaEnvelope className={`absolute left-5 top-1/2 -translate-y-1/2 text-lg transition-colors ${status === 'error' ? 'text-red-400' : status === 'success' ? 'text-green-400' : 'text-white/40 group-focus-within:text-white'}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
              placeholder="Enter your email address"
              className={`w-full bg-white/5 backdrop-blur-md border ${status === 'error' ? 'border-red-500/50 focus:border-red-500 text-red-100' : status === 'success' ? 'border-green-500/50 focus:border-green-500 text-green-100' : 'border-white/10 text-white placeholder:text-white/40 focus:border-white/30'} pl-14 pr-6 py-4 rounded-2xl outline-none text-sm md:text-base font-medium focus:bg-white/10 transition-all shadow-inner disabled:opacity-50`}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={status === "loading" || status === "success"}
            className={`w-full py-4 rounded-2xl font-extrabold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${status === 'success' ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-white text-black hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-white/10'} disabled:hover:scale-100 disabled:opacity-80`}
          >
            {status === "loading" && <FaSpinner className="animate-spin" />}
            {status === "success" && <FaCheckCircle />}
            {status === "idle" && "Subscribe to Newsletter"}
            {status === "loading" && "Subscribing..."}
            {status === "success" && "Subscribed!"}
            {status === "error" && "Try Again"}
          </button>

          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-2 text-sm font-medium px-2 ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}
              >
                {status === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
