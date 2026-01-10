import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Send, Users, LogOut, Circle, MessageSquare } from 'lucide-react';

const Chat = () => {
    const { name, room, socket, users, setUsers, setName, setRoom } = useContext(ChatContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!name) navigate('/');

        socket.on('message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socket.on('users', (roomUsers) => {
            setUsers(roomUsers);
        });

        return () => {
            socket.off('message');
            socket.off('users');
        };
    }, [name, navigate, socket, setUsers]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    const logout = () => {
        setName(''); setRoom('');
        navigate('/');
        window.location.reload(); 
    };

    return (
        <div className="flex flex-col w-full max-w-2xl h-[90vh] sm:h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="p-5 border-b bg-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {/* Icon integrated into Header */}
                        <div className="bg-cyan-100 p-2 rounded-xl text-cyan-600">
                            <MessageSquare size={24}/> 
                        </div>
                        <Circle size={10} className="absolute -bottom-1 -right-1 fill-green-500 text-green-500" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 capitalize leading-tight">{room}</h2>
                        <div className="flex items-center gap-2">
                            <Users size={12} className="text-slate-400" />
                            <p className="text-xs text-slate-400 font-medium">{users.length} active now</p>
                        </div>
                    </div>
                </div>
                <button onClick={logout} className="flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors">
                    Logout <LogOut size={16}/>
                </button>
            </div>

            {/* Messages Area */}
            <ScrollToBottom className="flex-1 p-6 overflow-y-auto bg-slate-50 messages">
                {messages.length > 0 ? (
                    messages.map((msg, i) => (
                        <div key={i} className={`mb-4 flex flex-col ${msg.user === name.toLowerCase() ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">{msg.user}</span>
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                                msg.user === name.toLowerCase() 
                                ? 'bg-slate-900 text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                ) : (
                    /* Centered Icon for Empty State */
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                        <div className="bg-slate-100 p-6 rounded-full">
                             <MessageSquare size={48} className="text-slate-200"/>
                        </div>
                        <p className="text-sm font-bold tracking-wide uppercase text-slate-400">No messages yet</p>
                        <p className="text-xs text-slate-300">Be the first to say hello!</p>
                    </div>
                )}
            </ScrollToBottom>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-3">
                <input 
                    className="flex-1 bg-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-all"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                    type="submit" 
                    disabled={!message}
                    className="bg-cyan-500 text-white p-4 rounded-2xl hover:bg-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-100"
                >
                    <Send size={20}/>
                </button>
            </form>
        </div>
    );
};

export default Chat;