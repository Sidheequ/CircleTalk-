import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "dark",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
    },
    toggleTheme: () => {
        const newTheme = localStorage.getItem("chat-theme") === "dark" ? "light" : "dark";
        localStorage.setItem("chat-theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        set({ theme: newTheme });
    },
    initTheme: () => {
        const savedTheme = localStorage.getItem("chat-theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
        set({ theme: savedTheme });
    },
}));
