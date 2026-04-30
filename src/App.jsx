import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import AdminDashboard from "./AdminDashboard.jsx";
import ChatPage from "./Chatbot.jsx";
import LoginPage from "./Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Chatbot as homepage */}
        <Route path="/" element={<ChatPage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
