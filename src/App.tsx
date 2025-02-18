import { useEffect, useRef, useState } from "react";
import "./App.css";
import AudioRecorder from "./components/AudioRecorder";
import { useAppDispatch } from "./app/hook";
import { addRecording } from "./features/recording/recordingThunk";
import RecordingsList from "./components/RecordingsList";

function App() {
  const dispatch = useAppDispatch();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [startTimer, setStartTimer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

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

  useEffect(() => {
    recordedBlob && setAudioUrl(URL.createObjectURL(recordedBlob));
  }, [recordedBlob]);

  function handleStopRecording(recordedData: {
    duration: number;
    audioBlob: Blob;
  }) {
    setRecordedBlob(recordedData.audioBlob);
    dispatch(
      addRecording({
        blob: recordedData.audioBlob,
        duration: recordedData.duration,
      })
    );
    setStartTimer(false);
  }

  return (
    <main className="text-center space-y-4">
      <AudioRecorder
        onStart={() => {
          setStartTimer(true);
        }}
        onStop={handleStopRecording}
        className="p-2 bg-blue-400 text-white rounded-md shadow-md"
        visualizer={canvasRef}
      />
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        className=" h-auto mb-4 border-2 border-gray-300 mx-auto"
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

      <RecordingsList />
    </main>
  );
}

export default App;
