import { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Gallery = () => {
  const { photos, deletePhotos } = useApp();
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const togglePhotoSelection = (index: number) => {
    setSelectedPhotos(prev =>
        prev.includes(index)
            ? prev.filter(i => i !== index)
            : [...prev, index]
    );
  };

  const handleDelete = () => {
    deletePhotos(selectedPhotos);
    setSelectedPhotos([]);
    setIsSelectionMode(false);
  };

  const cancelSelection = () => {
    setSelectedPhotos([]);
    setIsSelectionMode(false);
  };

  return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Galerie Photos</h2>
          {photos.length > 0 && !isSelectionMode && (
              <button
                  onClick={() => setIsSelectionMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sélectionner
              </button>
          )}
          {isSelectionMode && (
              <div className="flex space-x-2">
                <button
                    onClick={handleDelete}
                    disabled={selectedPhotos.length === 0}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                        selectedPhotos.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                    } text-white transition-colors`}
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Supprimer ({selectedPhotos.length})
                </button>
                <button
                    onClick={cancelSelection}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Annuler
                </button>
              </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
              <div
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer
              ${isSelectionMode ? 'hover:opacity-90' : ''} 
              ${selectedPhotos.includes(index) ? 'ring-4 ring-blue-500' : ''}`}
                  onClick={() => isSelectionMode && togglePhotoSelection(index)}
              >
                <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                />
                {selectedPhotos.includes(index) && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                )}
              </div>
          ))}
          {photos.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Aucune photo dans la galerie
              </div>
          )}
        </div>
      </div>
  );
};

export default Gallery;