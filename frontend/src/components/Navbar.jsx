import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import FoodHeroLogo from "../assets/FoodHeroLogo.png"; // Import the logo

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userType");
  const authToken = localStorage.getItem("authToken") || null;

  return (
    <>
      <header className="w-full py-4 px-4 md:px-8 border-b bg-gradient-to-t from-gray-100 to-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={FoodHeroLogo} alt="FoodHero Logo" className="h-10 w-10" />
            <Link to="/" className="text-2xl font-bold text-primary">
              FoodHero
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-15">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            {authToken && (
              <Link to="/viewProfile" className="text-sm font-medium hover:text-primary transition-colors">
                Profile
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {!authToken ? (
              <div>
                <Link to="/login">
                  <button className="rounded-full border px-4 py-2 text-sm  font-medium mr-4 hover:cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link to="/signUp">
                  <button className="rounded-full bg-green-600 text-white px-4 py-2 text-sm font-medium hover:cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              authToken && (
                <Link to="/">
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("userType");
                      window.location.reload();
                      navigate("/");
                    }}
                    className="rounded-full bg-gray-600 text-white px-4 py-2 text-sm font-medium hover:cursor-pointer"
                  >
                    Logout
                  </button>
                </Link>
              )
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
