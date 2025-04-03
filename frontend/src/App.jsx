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
import FaceRecognition from "./components/FaceRecogniton";
import FinalTransaction from "./pages/Transaction.jsx";
import ConfirmButtons from './components/TestOrderConfirm.jsx'
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
        <Route path="/facerecognition" element={<FaceRecognition/>} />
        <Route path="/transactions" element={<FinalTransaction/>} />
        <Route path="/transactionverify" element={ <ConfirmButtons 
        transactionId="67df9433e9dbe7464b5eb8bd" 
        serverUserId="67df8dfce9dbe7464b5eb8a3" 
        receiverUserId="67dee4db5844c17293a84dac" 
      />} />
        
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/list-food" element={<ListFood />} /> */}
        {/* <Route path="/marketplace" element={<Marketplace />} /> */}
        {/* <Route path="/order-confirmation" element={<OrderConfirmation />} /> */}
        {/* <Route path="/rewards" element={<Rewards />} /> */}
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
      </Routes>

      {authToken  && (
        <ChatBot />
      )}
      <Footer/>
    </Router>
  );
}

export default App;