import { useState, useRef, useEffect } from "react";
import { convertToMp3 } from "../utils/audio";
import { useAppDispatch } from "../app/hook";
import {
  removeRecording,
  updateRecordingNameThunk,
} from "../features/recording/recordingThunk";
import {
  Download,
  Loader2,
  Pause,
  Pen,
  Play,
  Save,
  Trash2,
} from "lucide-react";

function AudioPlayer({
  recording,
  editable = false,
  onNameEdit,
  handleSave,
  handleDiscard,
}: {
  recording: RecordingWithId;
  editable: boolean;
  onNameEdit?: (name: string) => void;
  handleSave?: () => void;
  handleDiscard?: () => void;
}) {
  const dispatch = useAppDispatch();
  const [isConverting, setIsConverting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [url, setUrl] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(recording.name);

  const handleNameSubmit = async () => {
    if (editedName.trim() !== recording.name) {
      editable && onNameEdit
        ? onNameEdit(editedName)
        : await dispatch(
            updateRecordingNameThunk({
              id: recording.id,
              newName: editedName.trim(),
            })
          );
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    } else if (e.key === "Escape") {
      setEditedName(recording.name);
      setIsEditing(false);
    }
  };

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
          <div className="flex gap-2 items-center">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={handleKeyDown}
                className="text-left font-semibold border rounded px-1 py-0.5 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            ) : (
              <p className="text-left font-semibold">{recording.name}</p>
            )}
            <button
              className="cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              <Pen size={12} className="inline" />
            </button>
          </div>
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
            className="p-4 flex-1 background text-white bg-blue-500 rounded-full hover:bg-blue-600 transition cursor-pointer"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>
      {/* Custom Play/Pause Button */}

      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Download Buttons */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          {recording.timestamp
            ? new Date(recording.timestamp).toLocaleString()
            : ""}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleDownloadMp3}
            className="text-blue-500 cursor-pointer hover:bg-gray-800 hover:text-blue-700 p-2 rounded-full"
          >
            {isConverting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Download size={20} />
            )}
          </button>
          {editable && (
            <button
              onClick={handleSave}
              className="text-green-500 cursor-pointer hover:bg-gray-800 hover:text-green-700 p-2 rounded-full"
            >
              <Save size={20} />
            </button>
          )}
          <button
            onClick={() => {
              editable && handleDiscard
                ? handleDiscard()
                : dispatch(removeRecording(recording.id));
            }}
            className="text-red-500 cursor-pointer hover:bg-gray-800 hover:text-red-700 p-2 rounded-full"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
