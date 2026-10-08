"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useSyncExternalStore,
} from "react";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";
const THEME_EVENT = "axyno:theme-change";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(event.newValue === "light" ? "light" : "dark");
    callback();
  };
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*,*::before,*::after{transition:none!important}"),
  );
  document.head.appendChild(style);

  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;

  window.getComputedStyle(document.body);
  setTimeout(() => style.remove(), 1);
}

function storedTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

const noopSubscribe = () => () => {};

const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")==="light"?"light":"dark",r=document.documentElement;r.classList.remove("dark","light");r.classList.add(t);r.style.colorScheme=t}catch(e){}`;

/** React never runs scripts it creates on the client, so this only exists in server HTML. */
export function ThemeScript() {
  const isServerRender = useSyncExternalStore(noopSubscribe, () => false, () => true);
  if (!isServerRender) return null;
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "dark");

  useLayoutEffect(() => {
    const saved = storedTheme();
    if (saved !== readTheme()) {
      applyTheme(saved);
      window.dispatchEvent(new Event(THEME_EVENT));
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    applyTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
