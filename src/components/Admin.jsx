import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, RefreshCw, LayoutGrid, User as UserIcon, Activity } from 'lucide-react';

const Admin = () => {
    const [currentRooms, setCurrentRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = () => {
        setLoading(true);
        // Ensure this matches your backend PORT
        axios.get('https://active-chat-backend-203412458873.asia-south1.run.app/allrooms')
            .then((res) => {
                setCurrentRooms(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Admin fetch error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        // Fetch immediately on load
        fetchRooms();

        // Refresh the monitor every 5 seconds to stay updated
        const interval = setInterval(fetchRooms, 5000); 
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-5xl p-4 md:p-8 bg-white rounded-3xl shadow-2xl border border-slate-100 min-h-[600px]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200">
                        <ShieldCheck size={32}/>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">System Monitor</h2>
                        <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm">
                            <Activity size={14} className="text-green-500" />
                            <span>{currentRooms.length} Active Connections</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={fetchRooms} 
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''}/>
                    Refresh Feed
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-white">
                <div className="bg-slate-900 p-6 rounded-3xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Users</p>
                    <h3 className="text-4xl font-black">{currentRooms.length}</h3>
                </div>
                <div className="bg-cyan-500 p-6 rounded-3xl">
                    <p className="text-cyan-100 text-xs font-bold uppercase tracking-widest mb-1">Active Rooms</p>
                    <h3 className="text-4xl font-black">
                        {[...new Set(currentRooms.map(u => u.room))].length}
                    </h3>
                </div>
                <div className="bg-indigo-500 p-6 rounded-3xl text-indigo-50">
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Server Status</p>
                    <h3 className="text-4xl font-black">Online</h3>
                </div>
            </div>

            {/* Live User Feed */}
            <h4 className="text-lg font-bold text-slate-800 mb-4 px-2">Live Connections</h4>
            {currentRooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentRooms.map((user, id) => (
                        <div key={id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-300 hover:bg-white transition-all group shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <LayoutGrid size={16}/>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{user.room}</span>
                                </div>
                                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-3 rounded-xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <UserIcon size={20}/>
                                </div>
                                <div>
                                    <p className="font-black text-slate-800">{user.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono uppercase">{user.id.substring(0, 8)}...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-300">
                    <Activity size={60} className="mb-4 opacity-20"/>
                    <p className="font-bold text-xl">No Active Sessions</p>
                    <p className="text-sm">Wait for users to log into rooms.</p>
                </div>
            )}
        </div>
    );
};

export default Admin;