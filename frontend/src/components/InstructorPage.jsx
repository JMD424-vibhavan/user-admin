import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const InstructorPage = () => {
  const navigate = useNavigate();
 

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("userRole");
      navigate("/admin/login"); // Redirect to login page
    }
  };
  useEffect(()=>{

  },[handleLogout]);

  console.log("instructor page loaded")
  return (
    <div>
      InstructorPage
      <button className='bg-amber-400 p-4'  onClick={handleLogout}>logout </button>
    </div>
  )
}

export default InstructorPage
