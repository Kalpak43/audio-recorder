import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteRecording,
  getRecordings,
  saveRecording,
} from "../../utils/indexedDB";

export const fetchRecordings = createAsyncThunk(
  "recordings/fetch",
  async () => {
    return await getRecordings();
  }
);

export const addRecording = createAsyncThunk(
  "recordings/add",
  async ({ name, blob }: { name?: string; blob: Blob }) => {
    const recordingName = name ?? new Date().toLocaleString();
    const id = await saveRecording({ name: recordingName, blob: blob });
    return {
      id,
      name: recordingName,
      blob,
      timestamp: Date.now(),
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
