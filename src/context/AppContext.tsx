import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
    photos: string[];
    addPhoto: (photo: string) => void;
    deletePhotos: (indices: number[]) => void;
    batteryLevel: number | null;
    isVibrationEnabled: boolean;
    toggleVibration: () => void;
    sendNotification: (title: string, body: string) => void;
    startWebOTPListener: () => void;
    otp: string;
    testVibration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
    const [otp, setOtp] = useState("");

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

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener("message", (event) => {
                if (event.data && event.data.type === "VIBRATE_CLIENT") {
                    navigator.vibrate(event.data.duration);
                }
            });
        }

        startWebOTPListener();
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
    };

    const testVibration = () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: "VIBRATE", duration: 500 });
        } else {
            navigator.vibrate(500);
        }
        alert("keoakeoakeoa")
    };

    const sendNotification = (title: string, body: string) => {
        if (Notification.permission === 'granted') {
            if (isVibrationEnabled && navigator.vibrate) {
                navigator.vibrate(200);
            }
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, {
                    body,
                    icon: '/icons/icon-192x192.png'
                });
            });
        }
    };

    const startWebOTPListener = () => {
        if (!("OTPCredential" in window)) return;

        const abortController = new AbortController();

        (navigator as any).credentials.get({
            otp: { transport: ["sms"] },
            signal: abortController.signal
        })
            .then((credential: any) => {
                console.log("Code OTP reçu :", credential.code);
                setOtp(credential.code);
                alert(`credential.code: ${credential.code}`);
            })
            .catch((err: any) => {
                if (err.name !== "AbortError") {
                    console.error("Erreur WebOTP :", err);
                }
            });

        return () => abortController.abort();
    };

    return (
        <AppContext.Provider value={{
            photos,
            addPhoto,
            deletePhotos,
            batteryLevel,
            isVibrationEnabled,
            toggleVibration,
            sendNotification,
            startWebOTPListener,
            otp,
            testVibration
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
