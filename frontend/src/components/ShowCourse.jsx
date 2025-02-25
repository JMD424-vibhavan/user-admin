import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from "../assets/Logo.jpg";
import Swal from 'sweetalert2';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
 
const ShowCourse = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
 
  useEffect(() => {
    const fetchCourses = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
 
      const userData = JSON.parse(storedUser);
      setUser(userData);
 
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setFilteredCourses(response.data); // Initially show all courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const fetchUserData = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      // If you have an endpoint to fetch updated user data, use it here
      const userData = JSON.parse(storedUser);
      const response = await axios.get(`http://localhost:5000/api/users/${userData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local storage with fresh user data
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching updated user data:', error);
    }
  };
 
  const handleFilterChange = (level) => {
    setSelectedLevel(level);
    if (level === "All Levels") {
      setFilteredCourses(courses); // Show all courses
    } else {
      const filtered = courses.filter(course => course.level === level);
      setFilteredCourses(filtered); // Filter courses by level
    }
  };
 
  const handleEnroll = async (courseId) => {
    try {
      // Make sure the token is included in the request headers
      const response = await axios.post(
        `http://localhost:5000/api/users/${user._id}/enroll`,
        { courseId }, // Pass only courseId in the body
        {
          headers: {
            Authorization: `Bearer ${token}` // Send the token in the Authorization header
          }
        }
      );
  
      if (response) {
        Swal.fire({
          title: "Start Learning!",
          text: "Successfully Added to the Course!",
          icon: "success",
        });
      }
  
      // Fetch updated user data after enrollment
      fetchUserData();
    } catch (error) {
      // Check if the error response contains the specific error message
      if (error.response && error.response.data && error.response.data.error === "User already enrolled in this course") {
        Swal.fire({
          title: "Already Enrolled",
          text: "You are already registered for this course",
          icon: "info",
        });
      } else {
        // Handle other errors
        Swal.fire({
          title: "Error",
          text: "Failed to enroll in the course. Please try again.",
          icon: "error",
        });
        console.error('Enrollment error:', error);
      }
    }
  };
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 !== 0; // Check if a half-star is needed
   
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-400" />);
      }
    }
    return stars;
  };
 
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-semibold text-center mb-6">All Courses</h2>
 
      {/* Filter Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-6 py-2 rounded-full ${selectedLevel === "All Levels" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => handleFilterChange("All Levels")}
        >
          All Levels
        </button>
        <button
          className={`px-6 py-2 rounded-full ${selectedLevel === "Beginner" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => handleFilterChange("Beginner")}
        >
          Beginner Level
        </button>
        <button
          className={`px-6 py-2 rounded-full ${selectedLevel === "Intermediate" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => handleFilterChange("Intermediate")}
        >
          Intermediate Level
        </button>
      </div>
 
      {/* Courses Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={Logo} alt={course.title} className="w-full h-48 object-contain my-2" />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
              <p className="text-gray-700 font-bold">Instructor: {course.instructor}</p>
              <p className="text-gray-500 mt-2">Level: {course.level}</p>
              <div className="flex items-center mt-2">
                {renderStars(course.rating)}
                <span className="text-gray-600 ml-2">({course.rating.toFixed(1)})</span>
              </div>
              <button
                className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                onClick={() => handleEnroll(course._id)}
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default ShowCourse;