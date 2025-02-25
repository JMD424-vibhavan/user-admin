import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      console.log(storedUser);
  
      if (!storedUser) return;
  
      const userData = JSON.parse(storedUser);
      setUser(userData);
  
      const token = localStorage.getItem('token'); // Get token from localStorage
  
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userData._id}/get-courses-by-id`,
          {
            headers: {
              Authorization: `Bearer ${token}` // Send token in Authorization header
            }
          }
        );
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  console.log(courses)

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Dashboard</h2>
        
        {user ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">Name: <span className="font-semibold">{user.name}</span></p>
            <p className="text-lg text-gray-700">Email: <span className="font-semibold">{user.email}</span></p>

            <h3 className="text-2xl font-semibold mt-6 mb-4">Enrolled Courses</h3>
            {courses.length > 0 ? (
              <ul className="space-y-4">
                {courses.map((course) => (
                  <li
                    key={course._id}
                    className="bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-200 transition duration-300"
                    onClick={() => navigate(`/enrolled-course/${course._id}`)}
                  >
                    <h4 className="text-xl font-bold text-blue-900">{course.title}</h4>
                    <p className="text-gray-600">Instructor: {course.instructor}</p>
                    <p className="text-gray-600">Rating: {course.rating} ⭐</p>
                    <p className="text-gray-600">Duration: {course.duration}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No enrolled courses</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading user details...</p>
        )}
      </div>
    </section>
  );
}
