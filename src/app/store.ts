import { configureStore } from "@reduxjs/toolkit";
import recordingProvider from "../features/recording/recordingSlice";
// ...

export const store = configureStore({
  reducer: {
    recordings: recordingProvider,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
