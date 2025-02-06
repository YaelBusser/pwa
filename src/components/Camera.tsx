import { useRef, useState, useEffect } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NotificationButton from "./NotificationButton";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { addPhoto, sendNotification } = useApp();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
        };
        setStream(mediaStream);
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      alert("Erreur d'accès à la caméra. Veuillez vérifier les permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photo = canvas.toDataURL('image/jpeg', 0.8);
        addPhoto(photo);
        sendNotification('Photo capturée', 'La photo a été ajoutée à votre galerie');
      }
    }
  };

  return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-lg aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <NotificationButton/>
          <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
          />
          {!isCameraActive && (
              <button
                  onClick={startCamera}
                  className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <CameraIcon className="h-12 w-12 mb-2" />
                  <span className="text-lg">Activer la caméra</span>
                </div>
              </button>
          )}
        </div>

        <div className="flex space-x-4">
          {isCameraActive && (
              <>
                <button
                    onClick={takePhoto}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center"
                >
                  <CameraIcon className="h-5 w-5 mr-2" />
                  Prendre une photo
                </button>
                <button
                    onClick={stopCamera}
                    className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  Arrêter la caméra
                </button>
              </>
          )}
        </div>
      </div>
  );
};

export default Camera;