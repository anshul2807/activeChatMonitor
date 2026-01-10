import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';

// Import your components
import Login from './components/Login';
import Chat from './components/Chat';
import Admin from './components/Admin';
// src/App.jsx
function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
        {/* Add basename here to match your vite.config.js */}
        <Router basename="/activeChatMonitor">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </ChatProvider>
  );
}

export default App;