
"use client";

import { useState, useEffect, useCallback } from 'react';

// This hook is designed to be SSR-safe.
// It initializes state with the defaultValue on the server, and then
// safely hydrates the client with the value from localStorage after mounting.
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  // This effect runs only on the client, after the initial render.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // This ensures that if no value is in localStorage, we use the default.
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
        setStoredValue(defaultValue);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(defaultValue);
    }
  }, [key, defaultValue]);


  const setValue = useCallback((value: T | ((val: T) => T)) => {
     if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though no document was found.`
      );
      return;
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);
  
  // Effect to sync changes across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch(error) {
            console.warn(`Error parsing storage change for key "${key}":`, error)
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
