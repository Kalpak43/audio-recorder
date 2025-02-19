import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../context/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className={`cursor-pointer z-50 fixed bottom-0 right-0 m-4 border-2 rounded-full p-4 transition-all duration-300 flex gap-2 justify-start items-center group ${
        theme === "dark"
          ? "bg-black hover:bg-white hover:text-black"
          : "bg-white hover:bg-black hover:text-white"
      }`}
      onClick={toggleTheme}
      initial={{ width: "3.5rem", height: "3.5rem" }}
      whileHover={{ width: "11rem" }}
      transition={{ duration: 0.1 }}
    >
      <div className="-ml-[0.1rem]">{theme === "dark" ? <Sun /> : <Moon />}</div>
      <motion.span
        className="uppercase  overflow-hidden whitespace-nowrap"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        exit={{ opacity: 0, width: 0 }}
      >
        {theme === "dark" ? "light Theme" : "dark Theme"}
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggler;
