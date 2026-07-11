import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: "SHOP.CO",
    currency: "PKR (Rs.)",
    deliveryFee: 15,
    discountPercent: 20
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const { data } = await api.put("/settings", newSettings);
      if (data.success) {
        setSettings(data.settings);
        return { success: true };
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      return { success: false };
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
