import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { fetchRecordings } from "../features/recording/recordingThunk";
import AudioPlayer from "./AudioPlayer";

function RecordingsList() {
  const dispatch = useAppDispatch();
  const recordings = useAppSelector((state) => state.recordings.list);

  useEffect(() => {
    dispatch(fetchRecordings());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      {recordings.map((recording) => (
        <AudioPlayer key={recording.id} recording={recording} />
      ))}
    </div>
  );
}

export default RecordingsList;
