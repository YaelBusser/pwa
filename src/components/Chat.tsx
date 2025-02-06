import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Settings } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
    content: string;
    dateEmis: string;
    pseudo: string;
    roomId: string;
    categorie: string;
}

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [roomId, setRoomId] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [showSystemMessages, setShowSystemMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString();
    };

    const connectToChat = () => {
        if (!pseudo || !roomId) return;

        const newSocket = io('https://mohammedelmehdi.makhlouk.angers.mds-project.fr', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        newSocket.on('connect', () => {
            newSocket.emit('chat-join-room', {
                pseudo,
                roomId,
            });
        });

        newSocket.on('chat-msg', (msg: Message) => {
            setMessages(prev => [...prev, msg]);
            if ('vibrate' in navigator) {
                navigator.vibrate(200);
            }
        });

        setSocket(newSocket);
        setIsConnected(true);
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !socket) return;

        const messageData = {
            content: newMessage,
            dateEmis: new Date().toISOString(),
            pseudo,
            roomId,
            categorie: 'MESSAGE',
        };
        socket.emit('chat-msg', messageData);
        setNewMessage('');
    };

    const updateRoom = () => {
        if (socket) {
            socket.emit('chat-leave-room', {
                pseudo,
                roomId,
            });
            socket.emit('chat-join-room', {
                pseudo,
                roomId,
            });
            setMessages([]);
        }
    };

    const filteredMessages = messages.filter(
        msg => showSystemMessages || msg.categorie !== 'INFO'
    );

    if (!isConnected) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    T'Chat
                </h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        placeholder="Pseudo..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Salle..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={connectToChat}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Rejoindre le t'chat
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    Chat Room
                </h2>
                <button
                    onClick={() => setIsConnected(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex gap-2 text-sm text-gray-600">
                    <span className="font-semibold">Salle:</span> {roomId}
                    <span className="font-semibold ml-4">Utilisateur:</span> {pseudo}
                </div>
            </div>

            <div className="h-[400px] overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
                {filteredMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${
                            msg.categorie === 'INFO'
                                ? 'flex justify-center'
                                : msg.pseudo === pseudo
                                    ? 'flex justify-end'
                                    : 'flex justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                msg.categorie === 'INFO'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : msg.pseudo === pseudo
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold">{msg.pseudo}</span>
                                <span className="opacity-75">{formatDate(msg.dateEmis)}</span>
                            </div>
                            <p className="break-words">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-4 items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Envoyer un message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <input
                    type="checkbox"
                    checked={showSystemMessages}
                    onChange={(e) => setShowSystemMessages(e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>Voir messages systèmes</span>
            </div>
        </div>
    );
}