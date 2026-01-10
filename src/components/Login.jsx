import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import { ArrowRight, MessageSquare } from 'lucide-react';

const Login = () => {
    const { name, setName, room, setRoom, socket, setUsers } = useContext(ChatContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for users in case we need to validate names early
        socket.on("users", users => setUsers(users));
    }, [socket, setUsers]);

    const handleLogin = () => {
        if (name && room) {
            socket.emit('login', { name, room }, (error) => {
                if (error) return alert(error);
                navigate('/chat');
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 w-full max-w-md">
            <div className="bg-cyan-500 p-4 rounded-3xl shadow-lg mb-6 text-white">
                <MessageSquare size={40} />
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tighter text-slate-800">ACTIVE CHAT</h1>
            <p className="text-slate-500 mb-8 font-medium">Create or join a room to start</p>
            
            <div className="space-y-4 w-full">
                <input 
                    className="w-full p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-cyan-500 focus:outline-none transition-all"
                    placeholder="User Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <input 
                    className="w-full p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-cyan-500 focus:outline-none transition-all"
                    placeholder="Room Name" 
                    value={room} 
                    onChange={(e) => setRoom(e.target.value)} 
                />
                <button 
                    onClick={handleLogin}
                    className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                    Get Started <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Login;