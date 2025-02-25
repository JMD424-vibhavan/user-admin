import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching Courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/admin")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
      >
        ← Back to Admin Dashboard
      </button>

      <h2 className="text-3xl font-semibold text-center mb-6">Courses</h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-lg font-medium">Total Courses: {courses.length}</p>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Instructor</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id} className="text-center bg-white">
                  <td className="border border-gray-300 px-4 py-2">{course.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.instructor}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No courses available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourses;
