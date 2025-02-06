import { useState, useEffect } from "react";
import { Battery, Phone, Vibrate, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";

const Settings = () => {
    const { batteryLevel, isVibrationEnabled, toggleVibration, testVibration } = useApp();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpStatus, setOtpStatus] = useState("En attente...");

    useEffect(() => {
        startWebOTPListener();
    }, []);

    const startWebOTPListener = () => {
        if (!("OTPCredential" in window)) return;

        setOtpStatus("Attente du code OTP...");
        const abortController = new AbortController();

        (navigator as any).credentials.get({
            otp: { transport: ["sms"] },
            signal: abortController.signal
        })
            .then((credential: any) => {
                alert(`Je suis dans OTP : ${credential} \n ${credential.code}`)
                setOtp(credential.code);
                setOtpStatus("Code OTP reçu !");
            })
            .catch((err: any) => {
                if (err.name !== "AbortError") {
                    setOtpStatus("Erreur lors de la récupération du code OTP.");
                }
            });

        return () => abortController.abort();
    };

    const handleCall = () => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Niveau de batterie */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Battery className="h-6 w-6 text-blue-600 mr-2" />
                    <span>Niveau de batterie</span>
                </div>
                <span className="font-semibold">
                    {batteryLevel !== null ? `${batteryLevel.toFixed(0)}%` : "N/A"}
                </span>
            </div>

            {/* Vibrations */}
            <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Vibrate className="h-6 w-6 text-blue-600 mr-2" />
                        <span>Vibrations</span>
                    </div>
                    <button
                        onClick={toggleVibration}
                        className={`px-4 py-2 rounded-full ${isVibrationEnabled ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                        {isVibrationEnabled ? "Activé" : "Désactivé"}
                    </button>
                </div>
                <button
                    onClick={testVibration}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Tester les vibrations
                </button>
            </div>

            {/* Appel téléphonique */}
            <div className="space-y-2">
                <div className="flex items-center">
                    <Phone className="h-6 w-6 text-blue-600 mr-2" />
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

            {/* OTP */}
            <div className="space-y-2">
                <div className="flex items-center">
                    <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
                    <span>Code OTP reçu</span>
                </div>
                <input
                    type="text"
                    value={otp}
                    placeholder="Code OTP"
                    className="flex-1 px-4 py-2 border rounded-lg"
                    readOnly
                />
                <p className="text-sm text-gray-600">{otpStatus}</p>
            </div>
        </div>
    );
};

export default Settings;
