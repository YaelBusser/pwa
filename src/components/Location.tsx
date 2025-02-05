import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const Location = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'adresse:", err);
      setError("Impossible de récupérer l'adresse");
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos);
          getAddress(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => setError(err.message)
      );
    } else {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center mb-6">
        <MapPin className="h-12 w-12 text-blue-600" />
      </div>
      {position ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Votre position</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Latitude:</span> {position.coords.latitude.toFixed(6)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Longitude:</span> {position.coords.longitude.toFixed(6)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Précision:</span> ±{position.coords.accuracy.toFixed(0)} mètres
              </p>
            </div>
          </div>
          
          {address && (
            <div className="text-center border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Adresse</h3>
              <p className="text-gray-600">{address}</p>
            </div>
          )}
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
          <p className="font-medium">Erreur:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <div className="animate-pulse">
            Chargement de la position...
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;