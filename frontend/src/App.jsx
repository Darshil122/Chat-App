import { Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const GoogleAuthWrapper = () => {
  return (
    <GoogleOAuthProvider clientId="555837498610-ppfvgp594tvisucv32pb770hhseladka.apps.googleusercontent.com">
      <Home />
    </GoogleOAuthProvider>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<GoogleAuthWrapper />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Navbar />
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
