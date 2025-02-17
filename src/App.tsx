import { useEffect, useRef, useState } from "react";
import "./App.css";
import AudioRecorder from "./components/AudioRecorder";

function App() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [startTimer, setStartTimer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (startTimer) {
      setElapsedTime(0); // Reset time
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTimer]);

  return (
    <main className="text-center">
      <AudioRecorder
        onStart={() => {
          setStartTimer(true);
        }}
        onStop={(url: string) => {
          setAudioUrl(url);
          setStartTimer(false);
        }}
        className="p-2 bg-blue-400 text-white rounded-md shadow-md"
        visualizer={canvasRef}
      />
      {startTimer && <p>Recording... Time: {elapsedTime}s</p>}
      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="mx-auto" />
          <a
            href={audioUrl}
            download="recording.wav"
            className="block mt-2 text-blue-500"
          >
            Download Recording
          </a>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        className="border border-gray-400"
      />
    </main>
  );
}

export default App;
