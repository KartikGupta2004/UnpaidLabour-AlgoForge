import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MarketplacePage from "./components/MarketplacePage";
import ProfilePage from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import CustomerService from "./pages/CustomerSupport";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot"; // ✅ Import Chatbot

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/viewProfile" element={<ProfilePage />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/contact" element={<CustomerService />} />
      </Routes>

      {/* ✅ Show Chatbot only on NON-Auth Pages */}
      {!["/login", "/signUp"].includes(window.location.pathname) && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatBot />
        </div>
      )}
    </Router>
  );
}

export default App;
