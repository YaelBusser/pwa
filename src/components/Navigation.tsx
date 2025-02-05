import { Link, useLocation } from 'react-router-dom';
import { Camera, Image, MapPin, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-4">
          <Link
            to="/"
            className={`flex flex-col items-center ${
              isActive('/') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Camera className="h-6 w-6" />
            <span className="text-sm">Caméra</span>
          </Link>
          <Link
            to="/gallery"
            className={`flex flex-col items-center ${
              isActive('/gallery') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Image className="h-6 w-6" />
            <span className="text-sm">Galerie</span>
          </Link>
          <Link
            to="/location"
            className={`flex flex-col items-center ${
              isActive('/location') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <MapPin className="h-6 w-6" />
            <span className="text-sm">Position</span>
          </Link>
          <Link
            to="/settings"
            className={`flex flex-col items-center ${
              isActive('/settings') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-sm">Paramètres</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;