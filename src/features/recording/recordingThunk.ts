import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteRecording,
  getRecordings,
  saveRecording,
} from "../../utils/indexedDB";

export const fetchRecordings = createAsyncThunk(
  "recordings/fetch",
  async () => {
    let recordings = await getRecordings();

    return recordings.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });
  }
);

export const addRecording = createAsyncThunk(
  "recordings/add",
  async ({
    name,
    blob,
    duration,
  }: {
    name?: string;
    blob: Blob;
    duration: number;
  }) => {
    const recordingName = name ?? new Date().toLocaleString();
    const id = await saveRecording({
      name: recordingName,
      blob: blob,
      duration: duration,
    });
    return {
      id,
      name: recordingName,
      blob,
      timestamp: Date.now(),
      duration: duration,
    } as RecordingWithId;
  }
);

export const removeRecording = createAsyncThunk(
  "recordings/remove",
  async (id: number) => {
    await deleteRecording(id);
    return id;
  }
);
