import { useState, useRef, useEffect } from "react";
import { convertToMp3 } from "../utils/audio";
import { useAppDispatch } from "../app/hook";
import { removeRecording } from "../features/recording/recordingThunk";
import { Download, Loader2, Pause, Play, Trash2 } from "lucide-react";

function AudioPlayer({ recording }: { recording: RecordingWithId }) {
  const dispatch = useAppDispatch();
  const [isConverting, setIsConverting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // Generate URL when component mounts
    const audioUrl = URL.createObjectURL(recording.blob);
    setUrl(audioUrl);

    return () => {
      // Cleanup: revoke URL when unmounting
      URL.revokeObjectURL(audioUrl);
    };
  }, [recording]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((error) => console.error("Playback error:", error));
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onLoadedMetadata = () => {
      setDuration(recording.duration / 1000 || 0);
    };

    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        requestAnimationFrame(updateProgress);
      }
    };

    audioRef.current.addEventListener("play", onPlay);
    audioRef.current.addEventListener("pause", onPause);
    audioRef.current.addEventListener("ended", onEnded);
    audioRef.current.addEventListener("loadedmetadata", onLoadedMetadata);
    audioRef.current.addEventListener("timeupdate", updateProgress);

    return () => {
      audioRef.current?.removeEventListener("play", onPlay);
      audioRef.current?.removeEventListener("pause", onPause);
      audioRef.current?.removeEventListener("ended", onEnded);
      audioRef.current?.removeEventListener("loadedmetadata", onLoadedMetadata);
      audioRef.current?.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  const handleDownloadMp3 = async () => {
    setIsConverting(true);
    const mp3Blob = await convertToMp3(recording.blob);
    setIsConverting(false);

    if (mp3Blob) {
      const mp3Url = URL.createObjectURL(mp3Blob);
      const a = document.createElement("a");
      a.href = mp3Url;
      a.download = recording.name + ".mp3";
      a.click();
      URL.revokeObjectURL(mp3Url);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-blue-300 rounded-md  w-full sm:min-w-sm">
      <div className="flex items-center justify-between gap-4 ">
        <div className="space-y-2 flex-1">
          <p className="text-left font-semibold">{recording.name}</p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 rounded-lg appearance-none bg-gray-300 cursor-pointer"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(48, 207, 208) 0%, #330867 100%)",
                backgroundSize: `${(progress / duration) * 100}% 100%`,
                backgroundRepeat: "no-repeat",
              }}
            />
            <p className="text-sm text-gray-600 font-bold">
              {Math.floor(duration)}s
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={handlePlayPause}
            className="p-4 flex-1 background text-white bg-blue-500 rounded-full hover:bg-blue-600 transition"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>
      {/* Custom Play/Pause Button */}

      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Download Buttons */}
      <div className="flex justify-between">
        <p className="text-xs text-gray-500">
          {recording.timestamp
            ? new Date(recording.timestamp).toLocaleString()
            : ""}
        </p>
        <div className="flex justify-end gap-4">
          <button onClick={handleDownloadMp3} className="text-blue-500">
            {isConverting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Download size={20} />
            )}
          </button>

          <button
            onClick={() => dispatch(removeRecording(recording.id))}
            className="text-red-500"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
