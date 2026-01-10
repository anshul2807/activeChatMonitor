import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

// Create the context
export const ChatContext = createContext();

// Initialize the socket outside the component to prevent multiple connections
// Change this URL to your deployed backend URL when you go live
const socket = io('https://active-chat-monitor-705615852872.asia-south2.run.app', { 
    transports: ['websocket', 'polling'] 
});

export const ChatProvider = ({ children }) => {
    // 1. User/Room State (formerly MainContext)
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    // 2. Room Users State (formerly UsersContext)
    const [users, setUsers] = useState([]);

    // Optional: Global notification state
    const [notification, setNotification] = useState(null);

    // Listen for global socket events that should update context state
    useEffect(() => {
        socket.on('users', (roomUsers) => {
            setUsers(roomUsers);
        });

        // Cleanup on unmount
        return () => {
            socket.off('users');
        };
    }, []);

    // The value object contains everything your components need
    const value = {
        socket,       // Socket instance
        name,         // Current user name
        setName,
        room,         // Current room name
        setRoom,
        users,        // List of users in current room
        setUsers,
        notification,
        setNotification
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};