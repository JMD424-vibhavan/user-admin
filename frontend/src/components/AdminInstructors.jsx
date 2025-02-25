import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admininstructors/${id}`);
      setInstructors(instructors.filter(instructor => instructor._id !== id));
    } catch (error) {
      console.error("Error deleting instructor:", error);
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

      <h2 className="text-3xl font-semibold text-center mb-6">Admin Instructors</h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-lg font-medium">Total Instructors: {instructors.length}</p>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Added Courses</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.length > 0 ? (
              instructors.map((instructor) => (
                <tr key={instructor._id} className="text-center bg-white">
                  <td className="border border-gray-300 px-4 py-2">{instructor.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{instructor.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {instructor.addedCourses.length > 0
                      ? instructor.addedCourses.map((course) => course.title).join(", ")
                      : "No courses added"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(instructor._id)}
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
                  No instructors available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInstructors;
