import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addRecording,
  fetchRecordings,
  removeRecording,
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
      );
  },
});

export default recordingSlice.reducer;
