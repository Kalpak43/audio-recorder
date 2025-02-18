import { useEffect, useRef, useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { Circle, Mic } from "lucide-react";
import { useAppDispatch } from "../app/hook";
import { addRecording } from "../features/recording/recordingThunk";

function RecorderComponent() {
  const dispatch = useAppDispatch();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [startTimer, setStartTimer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number>(0);

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
    setDuration(recordedData.duration);
    setStartTimer(false);
  }

  function handleSave() {
    if (recordedBlob)
      dispatch(
        addRecording({
          blob: recordedBlob,
          duration: duration,
        })
      );
  }

  return (
    <div className="space-y-4 ">
      <p className="text-white font-bold text-3xl">
        {startTimer ? elapsedTime : "00:00"}
      </p>
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        className=" h-auto mb-4 border-2 border-gray-300 mx-auto"
      />
      <AudioRecorder
        onStart={() => {
          setStartTimer(true);
        }}
        onStop={handleStopRecording}
        className={`p-2 text-white rounded-full p-4 shadow-md flex items-center mx-auto ${
          startTimer ? "bg-red-500 " : "bg-blue-400"
        }`}
        visualizer={canvasRef}
      >
        <Mic
          className={`${startTimer ? "text-red-500 " : "text-white"}`}
          size={32}
        />
      </AudioRecorder>

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
      {recordedBlob && <button onClick={handleSave}>Save Audio</button>}
    </div>
  );
}

export default RecorderComponent;
