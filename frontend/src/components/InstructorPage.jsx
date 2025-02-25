import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import InstructorDashboard from './InstructorDashboard';

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
   <InstructorDashboard/>
  )
}

export default InstructorPage
