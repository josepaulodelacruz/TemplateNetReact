// useScrollRestoration.ts
import { useEffect } from "react";
import { useLocation } from "react-router";

export const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }

    const savedPosition = sessionStorage.getItem(`scroll-position-${location.key}`);
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);
      window.scrollTo(x, y);
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem(
        `scroll-position-${location.key}`,
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sessionStorage.setItem(
        `scroll-position-${location.key}`,
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      );
    };
  }, [location]);
};

