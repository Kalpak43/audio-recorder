import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addRecording,
  fetchRecordings,
  removeRecording,
  updateRecordingNameThunk,
} from "./recordingThunk";

interface RecordingState {
  list: RecordingWithId[];
  loading: boolean;
}

const initialState: RecordingState = {
  list: [],
  loading: false,
};

const recordingSlice = createSlice({
  name: "recordings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecordings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecordings.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(
        addRecording.fulfilled,
        (state, action: PayloadAction<RecordingWithId>) => {
          state.list.push(action.payload);
        }
      )
      .addCase(
        removeRecording.fulfilled,
        (state, action: PayloadAction<IDBValidKey>) => {
          state.list = state.list.filter(
            (rec: RecordingWithId) => rec.id !== action.payload
          );
        }
      )
      .addCase(
        updateRecordingNameThunk.fulfilled,
        (state, action: PayloadAction<{ id: number; newName: string }>) => {
          const recording = state.list.find(
            (rec) => rec.id === action.payload.id
          );
          if (recording) {
            recording.name = action.payload.newName;
          }
        }
      );
  },
});

export default recordingSlice.reducer;
