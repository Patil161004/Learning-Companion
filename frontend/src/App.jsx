// frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';
import Chatbot from './pages/Chatbot';
import Checklist from './pages/Checklist';
import ChatHistory from './pages/ChatHistory';
import RoadmapHistory from './pages/RoadmapHistory';
import InterviewQuestions from './pages/Interview';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatbotFloater from './components/ChatbotFloater';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/chat-history" element={<ChatHistory />} />
            <Route path="/roadmap-history" element={<RoadmapHistory />} />
            <Route path="/interview-questions" element={<InterviewQuestions />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <ChatbotFloater />
      </div>
    </Router>
  );
}

export default App;
