import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

import AuthHero from "./components/AuthHero";
import AuthForm from "./components/AuthForm";

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
        
        <AuthHero />

        <AuthForm 
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          formData={formData}
          setFormData={setFormData}
          error={error}
          setError={setError}
          handleSubmit={handleSubmit}
          containerVariants={containerVariants}
        />

      </div>
    </div>
  );
};

export default AuthPage;
