// src/components/Appbar.jsx
import { Link, useNavigate } from 'react-router-dom';

function Appbar({ isLoggedIn, username }) {
  const navigate = useNavigate();
  
  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-gray-900">Coursify</Link>
      <div className="space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Welcome, {username}!</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg">Logout</button>
          </div>
        ) : (
          <>
            <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Signup</button>
            <button onClick={() => navigate('/login')} className="px-4 py-2 bg-green-500 text-white rounded-lg">Login</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Appbar;