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
import DonationPage from "./components/DonationPage";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
function App() {
  const authToken = localStorage.getItem("authToken"); 

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/donation" element={<DonationPage />} />
        <Route path="/viewProfile" element={<ProfilePage />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/contact" element={<CustomerService />} />
        <Route path="/about" element={<AboutUs/>} />
      </Routes>

      {authToken  && (
        <ChatBot />
      )}
      <Footer/>
    </Router>
  );
}

export default App;
