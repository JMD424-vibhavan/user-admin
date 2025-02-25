import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [courses, setCourses] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [students, setStudents] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
console.log(instructor)
  useEffect(() => {
    fetchInstructorDetails();
  }, []);

  useEffect(() => {
    // When instructor data is loaded, get the courses from instructor.addedCourses
    if (instructor && instructor.addedCourses) {
      setCourses(instructor.addedCourses);
      
      // Fetch student details for each course
      instructor.addedCourses.forEach(course => {
        fetchStudentsForCourse(course);
      });
    }
    setLoading(false);
  }, [instructor]);

  const fetchInstructorDetails = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("instructor"));
      if (!userData || !userData._id) {
        console.error("No instructor data found in localStorage");
        navigate("/"); // Redirect to login if no instructor data
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/admininstructors/${userData._id}`);
      setInstructor(response.data.instructor);
    } catch (error) {
      console.error("Error fetching instructor details:", error);
      setLoading(false);
    }
  };

  const fetchStudentsForCourse = async (course) => {
    if (!course.students || course.students.length === 0) {
      return;
    }
    
    try {
      // Create a new object to hold student data by courseId
      const courseStudents = [];
      
      // Fetch details for each student in the course
      for (const studentId of course.students) {
        const response = await axios.get(`http://localhost:5000/api/users/${studentId}`);
        if (response.data) {
          courseStudents.push(response.data);
        }
      }
      
      // Update the students state with the fetched data
      setStudents(prev => ({
        ...prev,
        [course._id]: courseStudents
      }));
    } catch (error) {
      console.error(`Error fetching students for course ${course._id}:`, error);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
      // Also update the instructor state to reflect the deleted course
      if (instructor) {
        setInstructor({
          ...instructor,
          addedCourses: instructor.addedCourses.filter(course => course._id !== courseId)
        });
      }
      // Clean up students state
      setStudents(prev => {
        const newStudents = {...prev};
        delete newStudents[courseId];
        return newStudents;
      });
      
      if (selectedCourse && selectedCourse._id === courseId) {
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("instructor");
    localStorage.removeItem("token");
    navigate("/");
  };

  const addCourse = async (courseData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/courses", courseData);
      // Update courses state with the new course
      const newCourse = response.data;
      setCourses([...courses, newCourse]);
      
      // Refresh instructor data to get updated addedCourses
      fetchInstructorDetails();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const viewCourseDetails = (course) => {
    setSelectedCourse(course);
    setActiveTab("CourseDetails");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-6">Instructor Panel</h2>
          <ul className="space-y-2">
            {["Dashboard", "Profile", "Add Courses"].map((tab) => (
              <li
                key={tab}
                className={`p-3 rounded-md cursor-pointer transition duration-150 ${
                  activeTab === tab ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
            {selectedCourse && (
              <li
                className={`p-3 rounded-md cursor-pointer transition duration-150 ${
                  activeTab === "CourseDetails" ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("CourseDetails")}
              >
                Course Details
              </li>
            )}
            <li 
              className="p-3 rounded-md cursor-pointer text-red-400 hover:bg-red-800 hover:text-white transition duration-150 mt-8"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "Dashboard" && (
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">My Courses</h2>
                {courses && courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <div key={course._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{course.level}</span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-sm text-gray-500">{course.duration}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{course.lectures}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <span className="ml-1 text-sm font-medium text-gray-700">{course.rating || "N/A"}</span>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {course.students ? course.students.length : 0} Students
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewCourseDetails(course)} 
                            className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition duration-150"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => deleteCourse(course._id)} 
                            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-600">You haven't added any courses yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Profile" && instructor && (
              <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Profile</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-32 font-medium text-gray-500">Name:</div>
                    <div className="flex-1 text-gray-800 font-semibold">{instructor.name}</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-32 font-medium text-gray-500">Email:</div>
                    <div className="flex-1 text-gray-800">{instructor.email}</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-32 font-medium text-gray-500">Courses:</div>
                    <div className="flex-1 text-gray-800">{instructor.addedCourses ? instructor.addedCourses.length : 0}</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-32 font-medium text-gray-500">Total Students:</div>
                    <div className="flex-1 text-gray-800">
                      {instructor.addedCourses ? 
                        instructor.addedCourses.reduce((total, course) => 
                          total + (course.students ? course.students.length : 0), 0) : 0}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-150">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Add Courses" && (
              <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add a New Course</h2>
                <form 
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const courseData = Object.fromEntries(formData);
                    
                    // Add instructor name and additional defaults
                    courseData.instructor = instructor ? instructor.name : "";
                    courseData.rating = 0;
                    courseData.students = [];
                    
                    await addCourse(courseData);
                    e.target.reset(); // Reset form after submission
                  }}
                >
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                    <input 
                      id="title"
                      name="title" 
                      placeholder="e.g., Advanced Web Development" 
                      className="p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      id="description"
                      name="description" 
                      placeholder="Detailed course description..." 
                      className="p-3 border border-gray-300 rounded-md w-full h-32 focus:ring-blue-500 focus:border-blue-500" 
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input 
                        id="duration"
                        name="duration" 
                        placeholder="e.g., 20 total hours" 
                        className="p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lectures" className="block text-sm font-medium text-gray-700 mb-1">Number of Lectures</label>
                      <input 
                        id="lectures"
                        name="lectures" 
                        placeholder="e.g., 40 lectures" 
                        className="p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                    <select 
                      id="level"
                      name="level" 
                      className="p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150"
                    >
                      Add Course
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "CourseDetails" && selectedCourse && (
              <div>
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setActiveTab("Dashboard")}
                    className="mr-4 text-blue-500 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-3xl font-semibold text-gray-800">Course Details</h2>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{selectedCourse.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">{selectedCourse.level}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{selectedCourse.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Duration</div>
                      <div className="font-semibold">{selectedCourse.duration}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Total Lectures</div>
                      <div className="font-semibold">{selectedCourse.lectures}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Rating</div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">{selectedCourse.rating || "N/A"}</span>
                        {selectedCourse.rating && (
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Enrolled Students ({selectedCourse.students ? selectedCourse.students.length : 0})</h3>
                  
                  {selectedCourse.students && selectedCourse.students.length > 0 ? (
                    <>
                      {students[selectedCourse._id] ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {students[selectedCourse._id].map((student, index) => (
                                <tr key={student._id || index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student._id}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{student.name || "Unknown"}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email || "Unknown"}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.enrolledDate || "Unknown"}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${student.progress || 0}%` }}></div>
                                    </div>
                                    <span className="text-xs text-gray-500">{student.progress || 0}%</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          <span className="ml-3 text-gray-600">Loading student data...</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No students enrolled in this course yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;