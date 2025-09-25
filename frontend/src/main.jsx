import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// import ChatProvider from "./Context/ChatProvider.js";

createRoot(document.getElementById("root")).render(
  // <ChatProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </ChatProvider>
);
