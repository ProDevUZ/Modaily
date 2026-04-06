"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CustomerProfile = {
  fullName: string;
  phone: string;
};

type CustomerProfileContextValue = {
  profile: CustomerProfile | null;
  isLoggedIn: boolean;
  saveProfile: (profile: CustomerProfile) => void;
  clearProfile: () => void;
};

const STORAGE_KEY = "modaily-customer-profile";

const CustomerProfileContext = createContext<CustomerProfileContextValue | null>(null);

export function CustomerProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      setProfile(JSON.parse(saved) as CustomerProfile);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [profile]);

  return (
    <CustomerProfileContext.Provider
      value={{
        profile,
        isLoggedIn: Boolean(profile),
        saveProfile: (nextProfile) => setProfile(nextProfile),
        clearProfile: () => setProfile(null)
      }}
    >
      {children}
    </CustomerProfileContext.Provider>
  );
}

export function useCustomerProfile() {
  const context = useContext(CustomerProfileContext);

  if (!context) {
    throw new Error("useCustomerProfile must be used within CustomerProfileProvider");
  }

  return context;
}
