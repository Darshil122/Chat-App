import { Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile";
import EditUserProfile from "./pages/EditUserProfile";
import GroupProfile from "./pages/GroupProfile";

function App() {
  return (
    <GoogleOAuthProvider clientId="555837498610-ppfvgp594tvisucv32pb770hhseladka.apps.googleusercontent.com">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Navbar />
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/GroupProfile/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <GroupProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofile"
          element={
            <ProtectedRoute>
              <EditUserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}


export default App;
