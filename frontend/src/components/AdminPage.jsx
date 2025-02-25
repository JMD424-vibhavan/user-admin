import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    console.log(courses)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/adminusers");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get("/admininstructors");
        setInstructors(response.data.instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses");
        setCourses(response.data ); // Fallback to empty array
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);
  console.log(courses);
  // Logout function with confirmation
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("userRole");
      navigate("/admin/login"); // Redirect to login page
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <ul>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <Link to="/admin/instructors">Instructor Management</Link>
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <Link to="/admin/users">User Management</Link>
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <Link to="/admin/courses">Course management</Link>
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <button onClick={handleLogout} className="w-full text-left">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome back, Admin!
        </h1>

        {/* Example Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-gray-800">{users.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Instructors
            </h3>
            <p className="text-3xl font-bold text-gray-800">{instructors.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">
              Available courses
            </h3>
            <p className="text-3xl font-bold text-gray-800">{courses?.length}</p>
          </div>
        </div>

        {/* Quick Links or Features */}
        

          
        </div>
      </div>
    
  );
};

export default AdminPage;
