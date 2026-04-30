import { useEffect } from "react";
import { useAuth } from "./useAuth";

const EVENTS = ["mousemove", "keydown", "click", "scroll"] as const;

export function useSessionTimeout(timeoutMs = 30 * 60 * 1000) {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    let timer = setTimeout(logout, timeoutMs);
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, timeoutMs);
    };

    EVENTS.forEach((e) => window.addEventListener(e, reset));
    return () => {
      clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [isAuthenticated, logout, timeoutMs]);
}
