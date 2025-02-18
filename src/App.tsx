import "./App.css";
import RecorderComponent from "./components/RecorderComponent";
import RecordingsList from "./components/RecordingsList";

function App() {
  return (
    <main className="background text-center space-y-4 grid grid-cols-1 md:grid-cols-2 py-8 px-8 md:px-20 max-h-[100dvh]">
      <RecorderComponent />
      <RecordingsList />
    </main>
  );
}

export default App;
