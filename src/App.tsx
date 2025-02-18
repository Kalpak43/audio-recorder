import "./App.css";
import MessagePanel from "./components/MessagePanel";
import RecorderComponent from "./components/RecorderComponent";
import RecordingsList from "./components/RecordingsList";
import WaveBackground from "./components/WaveBackground";

function App() {
  return (
    <main className="bg-[#030303] text-white text-center flex items-center justify-center py-8 px-8 md:px-20 h-[100dvh]">
      <RecorderComponent />
      <RecordingsList />
      <MessagePanel />
      <WaveBackground />
    </main>
  );
}

export default App;
