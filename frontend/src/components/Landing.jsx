import { useNavigate } from 'react-router-dom';
import Appbar from './Appbar';
import videoBg from '../assets/vid.mp4';

function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <Appbar />
      <div className="relative w-full h-screen overflow-hidden">
        <video className="absolute w-full h-full object-cover" src={videoBg} autoPlay muted loop></video>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Coursify</h1>
          <button onClick={() => navigate('/signup')} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Get Started</button>
        </div>
      </div>
    </>
  );
}

export default Landing;
