import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  // Get the user's role from localStorage
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');
  
  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Check if the user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on actual role
    if (userRole === 'User') {
      return <Navigate to="/home" />;
    } else if (userRole === 'Admin') {
      return <Navigate to="/admin" />;
    } else if (userRole === 'Instructor') {
      return <Navigate to="/instructor" />;
    } else {
      // Fallback if role is invalid
      return <Navigate to="/login" />;
    }
  }
  
  // User is authenticated and has the required role
  return element;
};

export default ProtectedRoute;