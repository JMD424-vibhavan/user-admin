import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        });
        setCourse(res.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (!course) return <p className="text-center text-gray-500 mt-10">Loading course details...</p>;

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h2>
        <p className="text-lg text-gray-700">Instructor: <span className="font-semibold">{course.instructor}</span></p>
        <p className="text-lg text-gray-700">Rating: ⭐ {course.rating}</p>
        <p className="text-lg text-gray-700">Duration: {course.duration}</p>
        <p className="text-lg text-gray-700">Level: {course.level}</p>
        <p className="text-gray-600 mt-4">{course.description}</p>
        <p className="text-gray-600 mt-4">{course.content}</p>
        <button 
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </section>
  );
}
