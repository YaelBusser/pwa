'use client';

import { useEffect, useState } from 'react';

const NotificationButton = () => {
    const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
    const [permission, setPermission] = useState<NotificationPermission | null>(null);

    useEffect(() => {
        if ('Notification' in window) {
            const perm = Notification.permission;
            setPermission(perm);
            setIsSubscribed(perm === 'granted');
        } else {
            console.warn('Notifications non supportées par ce navigateur.');
            setIsSubscribed(false);
        }
    }, []);

    const handleSubscribe = async () => {
        if (!('Notification' in window)) {
            console.warn('Notifications non supportées par ce navigateur.');
            return;
        }

        const newPermission = await Notification.requestPermission();
        setPermission(newPermission);
        if (newPermission === 'granted') {
            setIsSubscribed(true);
            new Notification('Abonnement réussi', {
                body: 'Vous êtes maintenant abonné aux notifications.',
                icon: '/icons/icon-192x192.png',
            });
        } else {
            console.warn("L'utilisateur a refusé les notifications.");
        }
    };

    if (isSubscribed === null) {
        return null;
    }

    return (
        <div>
            {!isSubscribed && permission !== 'denied' && (
                <button onClick={handleSubscribe}>Activer les notifications</button>
            )}
            {permission === 'denied' && (
                <p style={{ color: 'red' }}>
                    Les notifications sont bloquées dans les paramètres du navigateur.
                </p>
            )}
        </div>
    );
};

export default NotificationButton;
