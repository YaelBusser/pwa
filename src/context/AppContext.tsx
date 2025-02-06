import React, {createContext, useContext, useState, useEffect} from 'react';

interface AppContextType {
    photos: string[];
    addPhoto: (photo: string) => void;
    deletePhotos: (indices: number[]) => void;
    batteryLevel: number | null;
    isVibrationEnabled: boolean;
    toggleVibration: () => void;
    sendNotification: (title: string, body: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);

    useEffect(() => {
        const savedPhotos = localStorage.getItem('photos');
        if (savedPhotos) {
            setPhotos(JSON.parse(savedPhotos));
        }

        if ('Notification' in window) {
            Notification.requestPermission();
        }

        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                setBatteryLevel(battery.level * 100);
                battery.addEventListener('levelchange', () => {
                    setBatteryLevel(battery.level * 100);
                });
            });
        }
    }, []);

    const addPhoto = (photo: string) => {
        const newPhotos = [...photos, photo];
        setPhotos(newPhotos);
        localStorage.setItem('photos', JSON.stringify(newPhotos));
    };

    const deletePhotos = (indices: number[]) => {
        const newPhotos = photos.filter((_, index) => !indices.includes(index));
        setPhotos(newPhotos);
        localStorage.setItem('photos', JSON.stringify(newPhotos));
    };

    const toggleVibration = () => {
        setIsVibrationEnabled(!isVibrationEnabled);
        console.log("ok")
    };
    const sendNotification = (title: string, body: string) => {
        if (Notification.permission === "granted") {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification(body, {
                    body: body,
                });
            });
        } else {
            new Notification(body, {
                body: body,
                icon: '/icons/icon-192x192.png'
            });
        }
        if (Notification.permission === 'granted') {
            if (isVibrationEnabled && navigator.vibrate) {
                navigator.vibrate(200);
            }
            new Notification(title, {
                body,
                icon: '/icons/icon-192x192.png'
            });
        }
    };

    return (
        <AppContext.Provider value={{
            photos,
            addPhoto,
            deletePhotos,
            batteryLevel,
            isVibrationEnabled,
            toggleVibration,
            sendNotification
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};