import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { MdComputer } from "react-icons/md";
import { useState } from "react";
 
const Header = ({ handleLogout: propHandleLogout }) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
 
  const handleLogoutClick = () => {
    console.log("Logout clicked");
    setShowLogoutPopup(true);
  };
 
  const confirmLogout = () => {
    console.log("Confirm Logout clicked");
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/"); // Redirect after logout
    if (propHandleLogout) {
      propHandleLogout(); // Call parent logout function if provided
    }
  };
 
  return (
    <div>
      <header
        className="sticky top-0 p-5 shadow-md flex justify-between items-center px-10"
        style={{ backgroundColor: "#ffe69a" }}
      >
        <div className="flex items-center space-x-4">
          <MdComputer className="text-secondary text-4xl text-black" />
          <h1 className="text-3xl font-extrabold tracking-wide text-black">
            J-Learn
          </h1>
        </div>
        <nav className="flex space-x-8 text-lg font-medium text-gray-600">
          <Link to="/home" className="hover:text-black transition">Home</Link>
          <Link to="/about" className="hover:text-black transition">About Us</Link>
          <Link to="/courses" className="hover:text-black transition">Courses</Link>
          <div className="flex space-x-8 text-lg font-medium">
            <Link to="/dashboard" className="hover:text-black transition flex items-center space-x-2">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <button onClick={handleLogoutClick} className="hover:text-black transition flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </header>
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
    </div>
  );
};
 
export default Header;
 
 