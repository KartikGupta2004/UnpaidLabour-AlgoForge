import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import Dashboard from "./pages/Dashboard";
// import ListFood from "./pages/ListFood";
// import Marketplace from "./pages/Marketplace";
// import OrderConfirmation from "./pages/OrderConfirmation";
// import Rewards from "./pages/Rewards";
// import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import ListedItem from "./components/ListedItem";
// import PriceAI from './components/PriceAI';
// import PageOne from './components/PageOne';
import MarketplacePage from './components/MarketplacePage';
import DonationPage from "./components/DonationPage";
import ProfilePage from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import CustomerService from "./pages/CustomerSupport";
import ChatBot from "./components/ChatBot";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/chatbot" element={<ChatBot/>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/donation" element={<DonationPage/>} />
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
