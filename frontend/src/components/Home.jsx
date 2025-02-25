import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import Logo from '../assets/Logo.jpg'
import WhyChooseUs from "./WhyChooseUs";
import Hero from "./Hero";
import SubjectCard from "./SubjectCard";
import Footer from "./Footer";
import Header from "./Header";

export default function Home() {

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout button clicked");
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    console.log("Confirm Logout clicked");
    localStorage.removeItem("token");

    setShowLogoutPopup(false);
    navigate("/"); // Redirect to landing page after logout
  };

  return (
    <div>
      {/* Header */}
      {/* <header className=" text-white p-5 shadow-md flex justify-between items-center px-10" style={{ backgroundColor: "#ffe69a" }}>
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Logo" className="h-12 rounded-full shadow-md" />
          <h1 className="text-3xl font-extrabold tracking-wide text-black italic">J-Learn</h1>
        </div>
        <nav className="flex space-x-8 text-lg font-medium text-black">
          <Link to="/" className="hover:text-gray-200 transition">Home</Link>
          <Link to="/about" className="hover:text-gray-200 transition">About Us</Link>
          <Link to="/courses" className="hover:text-gray-200 transition">Courses</Link>
          <nav className="flex space-x-8 text-lg font-medium">
          <Link to="/dashboard" className="hover:text-gray-200 transition flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <button onClick={handleLogout} className="hover:text-gray-200 transition flex items-center space-x-2">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
        </nav>
      </header> */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmLogout}
                className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-hidden flex flex-col items-center justify-center" >
      <Hero/>
      <WhyChooseUs/>
      <SubjectCard/>
      <Footer/>
      </div>
      
    </div>
  );
}
