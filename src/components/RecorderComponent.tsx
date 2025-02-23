import { useEffect, useRef, useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { Mic } from "lucide-react";
import { useAppDispatch } from "../app/hook";
import { addRecording } from "../features/recording/recordingThunk";
import AudioPlayer from "./AudioPlayer";
import { useMessenger } from "../useMessenger";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeProvider";

function RecorderComponent() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [hide, setHide] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [name, setName] = useState<string>("");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const { showMessage } = useMessenger();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // @ts-ignore
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

  function handleStopRecording(recordedData: {
    duration: number;
    audioBlob: Blob;
  }) {
    setName("REC: " + new Date().toLocaleString());
    setRecordedBlob(recordedData.audioBlob);
    setDuration(recordedData.duration);
    setStartTimer(false);
  }

  function handleSave() {
    if (recordedBlob)
      dispatch(
        addRecording({
          name: name,
          blob: recordedBlob,
          duration: duration,
        })
      );
    showMessage("Saved to your recordings.", "success");
    handleDiscard();
  }

  const handleDiscard = () => {
    setRecordedBlob(null);
    setName("");
    setDuration(0);
    setHide(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 ">
      <AnimatePresence>
        {recordedBlob ? (
          <motion.div
            key="recorded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AudioPlayer
              recording={{
                id: -12,
                name: name,
                blob: recordedBlob,
                duration: duration,
                timestamp: new Date(),
              }}
              editable={true}
              onNameEdit={(name: string) => setName(name)}
              handleSave={handleSave}
              handleDiscard={handleDiscard}
            />
          </motion.div>
        ) : (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!hide && (
              <h1
                className={`text-5xl font-bold mb-8 ${
                  theme == "dark" ? "text-[#30cfd0]" : "text-[#330867]"
                }`}
              >
                Start Recording
              </h1>
            )}
            <p
              className={`font-bold text-3xl ${
                theme == "dark" ? "text-white" : "text-black"
              }`}
            >
              {startTimer ? formatTime(elapsedTime) : "00:00"}
            </p>
            <div className="relative group">
              <AudioRecorder
                onStart={() => {
                  setStartTimer(true);
                  setHide(true);
                }}
                onStop={handleStopRecording}
                className={`background p-2 text-white overflow-hidden rounded-full p-4 h-30 aspect-square flex items-center justify-center shadow-md flex items-center mx-auto relative ${
                  startTimer ? "background-2" : "background"
                }`}
                visualizer={canvasRef}
              >
                <Mic
                  className={`${startTimer ? "text-red-500 " : "text-white"}`}
                  size={32}
                />
                <canvas
                  ref={canvasRef}
                  className="inset-0 h-full w-full mb-4 mx-auto absolute"
                />
              </AudioRecorder>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mb-1 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1">
                {startTimer ? "Stop Recording" : "Start Recording"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RecorderComponent;
