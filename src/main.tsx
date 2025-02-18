import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { MessengerProvider } from "./useMessenger.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MessengerProvider>
        <App />
      </MessengerProvider>
    </Provider>
  </StrictMode>
);
