import {useState} from 'react';
import {useApp} from '../context/AppContext';
import {Battery, Phone, Vibrate, MessageSquare} from 'lucide-react';

const Settings = () => {
    const {batteryLevel, isVibrationEnabled, toggleVibration} = useApp();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');

    const handleCall = () => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    const handleWebOTP = async () => {
        try {
            if ('OTPCredential' in window) {
                const abortController = new AbortController();

                const credential = await (navigator as any).credentials.get({
                    otp: { transport: ['sms'] },
                    signal: abortController.signal
                });

                setOtp(credential.code);

                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('OTP Received', {
                        body: 'Your verification code has been automatically detected',
                        icon: '/vite.svg'
                    });
                    if ('vibrate' in navigator) {
                        navigator.vibrate(200);
                    }
                }
            } else {
                alert('WebOTP is not supported on this device/browser');
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
            alert('Failed to read SMS. Make sure you are on a supported device and browser.');
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Battery className="h-6 w-6 text-blue-600 mr-2"/>
                        <span>Niveau de batterie</span>
                    </div>
                    <span className="font-semibold">
                        {batteryLevel !== null ? `${batteryLevel.toFixed(0)} %` : 'N/A'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Vibrate className="h-6 w-6 text-blue-600 mr-2"/>
                        <span>Vibrations</span>
                    </div>
                    <button
                        onClick={toggleVibration}
                        className={`px-4 py-2 rounded-full ${
                            isVibrationEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}
                    >
                        {isVibrationEnabled ? 'Activé' : 'Désactivé'}
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center">
                        <Phone className="h-6 w-6 text-blue-600 mr-2"/>
                        <span>Appel téléphonique</span>
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Numéro de téléphone"
                            className="flex-1 px-4 py-2 border rounded-lg"
                        />
                        <button
                            onClick={handleCall}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Appeler
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center">
                        <MessageSquare className="h-6 w-6 text-blue-600 mr-2"/>
                        <span>Validation SMS (WebOTP)</span>
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Code OTP"
                            className="flex-1 px-4 py-2 border rounded-lg"
                        />
                        {
                            otp
                        }
                        <button
                            onClick={handleWebOTP}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Lire SMS
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;