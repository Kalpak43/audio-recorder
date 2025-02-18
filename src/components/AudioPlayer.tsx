import { useRef, useState } from "react";
import { convertToMp3 } from "../utils/audio";
import { useAppDispatch } from "../app/hook";
import { removeRecording } from "../features/recording/recordingThunk";

function AudioPlayer({ recording }: { recording: RecordingWithId }) {
  console.log(recording);
  const dispatch = useAppDispatch();
  const [isConverting, setIsConverting] = useState(false);
  const url = URL.createObjectURL(recording.blob);

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
    <div className="">
      <p>{recording.name}</p>
      <p className="font-bold">{recording.duration}</p>
      <audio controls preload="metadata" className="mx-auto">
        <source src={url} />
      </audio>
      <a
        href={url}
        download={recording.name + ".wav"}
        className="block mt-2 text-blue-500"
      >
        Download Original (WAV)
      </a>

      <button onClick={handleDownloadMp3} className="mt-2 text-blue-500">
        {isConverting ? "Converting..." : "Download MP3"}
      </button>

      <button
        onClick={() => {
          dispatch(removeRecording(recording.id));
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default AudioPlayer;
