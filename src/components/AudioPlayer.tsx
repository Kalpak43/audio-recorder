import React, { useState } from "react";
import { Mp3Encoder } from "@breezystack/lamejs";
import { convertToMp3 } from "../utils/audio";

function AudioPlayer({ recording }: { recording: RecordingWithId }) {
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
      <audio controls preload="metadata">
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
    </div>
  );
}

export default AudioPlayer;
