import { useTheme } from "../context/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`cursor-pointer z-50 fixed bottom-0 right-0 m-4 border-2 rounded-full p-4 transition-all duration-300 ${
        theme == "dark"
          ? "bg-black hover:bg-white hover:text-black"
          : "bg-white hover:bg-black hover:text-white"
      }`}
      onClick={toggleTheme}
    >
      {theme == "dark" ? <Sun fill="white" /> : <Moon fill="white" />}
    </button>
  );
};

export default ThemeToggler;
