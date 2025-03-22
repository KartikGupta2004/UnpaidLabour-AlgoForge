import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FaceRecognition from './components/FaceRecognition';
import Chatbot  from './components/ChatBot';
import ConfirmButtons from './components/TestOrderConfirm';

<<<<<<< Updated upstream
// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div className="App">
//       <PageOne/>
//       {/* <FaceRecognition /> */}
//       {/* <Chatbot/> */}
//       {/* <FaceRecognition /> */}
//       {/* <ConfirmButtons transactionId="67dd9d68d2867db3f7559abe" serverUserId="67dd9d21d2867db3f7559abd" receiverUserId="67dd9c2fd2867db3f7559abc" /> */}
//       </div>
     
//     </>
//   )
// }

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
=======
// import PriceAI from './components/PriceAI';
import PageOne from './components/PageOne';
import GeolocationComponent from './components/GeolocationComponent';

>>>>>>> Stashed changes
function App() {
  const [count, setCount] = useState(0)

  return (
<<<<<<< Updated upstream
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
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
=======
    <>
      <div className="App">
        {/* <GeolocationComponent/> */}
      {/* <PageOne/> */}
      {/* <FaceRecognition /> */}
      <Chatbot/>
      {/* <FaceRecognition /> */}
      {/* <ConfirmButtons transactionId="67dd9d68d2867db3f7559abe" serverUserId="67dd9d21d2867db3f7559abd" receiverUserId="67dd9c2fd2867db3f7559abc" /> */}
      </div>
     
    </>
  )
>>>>>>> Stashed changes
}

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Home from "./pages/Home";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp/SignUpForIndividual";
// // import Dashboard from "./pages/Dashboard";
// // import ListFood from "./pages/ListFood";
// // import Marketplace from "./pages/Marketplace";
// // import OrderConfirmation from "./pages/OrderConfirmation";
// // import Rewards from "./pages/Rewards";
// // import AdminPanel from "./pages/AdminPanel";
// // import Navbar from "./components/Navbar";
// // import Footer from "./components/Footer";

// function App() {
//   return (
//     <Router>
//       {/* <Navbar /> */}
//       <Routes>
//         {/* <Route path="/" element={<Home />} /> */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signUp" element={<SignUp />} />
//         {/* <Route path="/dashboard" element={<Dashboard />} /> */}
//         {/* <Route path="/list-food" element={<ListFood />} /> */}
//         {/* <Route path="/marketplace" element={<Marketplace />} /> */}
//         {/* <Route path="/order-confirmation" element={<OrderConfirmation />} /> */}
//         {/* <Route path="/rewards" element={<Rewards />} /> */}
//         {/* <Route path="/admin" element={<AdminPanel />} /> */}
//       </Routes>
//       {/* <Footer /> */}
//     </Router>
//   );
// }

export default App;

