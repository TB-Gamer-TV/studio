
"use client";

import { useState, useEffect, useCallback } from 'react';

// This hook is designed to be SSR-safe.
// It initializes state by trying to read from localStorage on the client,
// but falls back to the default value on the server or if the key doesn't exist.
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((val: T) => T)) => void] {
  
  const readValue = useCallback((): T => {
    // Prevent build errors from trying to use "window" on the server
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  }, [key, defaultValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    // Prevent build errors from trying to use "window" on the server
     if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though no document was found.`
      );
      return;
    }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // This is a safety measure to ensure the state is up-to-date
  // if the localStorage is changed by another tab.
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue];
}
