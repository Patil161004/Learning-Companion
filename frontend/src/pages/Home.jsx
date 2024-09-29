// frontend/src/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="absolute top-4 left-4 text-blue-500 hover:underline">
        <button onClick={() => setIsSidebarOpen(true)}>☰</button>
      </div>
      <h1 className="text-4xl font-bold mb-8">Welcome to Learning Companion</h1>
      <div className="space-x-4">
        <Link to="/roadmap" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition duration-300">
          Create Roadmap
        </Link>
        <Link to="/chatbot" className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition duration-300">
          Open Chatbot
        </Link>
        <Link to="/checklist" className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition duration-300">
          Checklist
        </Link>
        <Link to="/interview-questions" className="bg-purple-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-600 transition duration-300">
          Interview Questions
        </Link>
      </div>
    </div>
  );
};

export default Home;