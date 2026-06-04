import React, { createContext, useState, useContext, useEffect } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("shop_settings");
    return saved ? JSON.parse(saved) : {
      storeName: "SHOP.CO Official Outlet",
      currency: "PKR (Rs.)",
      adminEmail: "admin@shop.co",
      adminPassword: "admin123"
    };
  });

  useEffect(() => {
    localStorage.setItem("shop_settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
