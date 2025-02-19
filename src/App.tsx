import "./App.css";
import MessagePanel from "./components/MessagePanel";
import RecorderComponent from "./components/RecorderComponent";
import RecordingsList from "./components/RecordingsList";
import ThemeToggler from "./components/ThemeToggler";
import WaveBackground from "./components/WaveBackground";
import { useTheme } from "./context/ThemeProvider";

function App() {
  const { theme } = useTheme();

  return (
    <main
      className={
        theme +
        " text-center flex items-center justify-center py-8 px-8 md:px-20 h-[100dvh]"
      }
    >
      <RecorderComponent />
      <RecordingsList />
      <MessagePanel />
      <ThemeToggler />
      <WaveBackground />
    </main>
  );
}

export default App;
