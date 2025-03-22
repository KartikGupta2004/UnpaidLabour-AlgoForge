import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp/SignUpForIndividual";
// import Dashboard from "./pages/Dashboard";
// import ListFood from "./pages/ListFood";
// import Marketplace from "./pages/Marketplace";
// import OrderConfirmation from "./pages/OrderConfirmation";
// import Rewards from "./pages/Rewards";
// import AdminPanel from "./pages/AdminPanel";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/list-food" element={<ListFood />} /> */}
        {/* <Route path="/marketplace" element={<Marketplace />} /> */}
        {/* <Route path="/order-confirmation" element={<OrderConfirmation />} /> */}
        {/* <Route path="/rewards" element={<Rewards />} /> */}
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;

