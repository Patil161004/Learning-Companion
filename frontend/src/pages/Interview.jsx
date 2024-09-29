import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

const Interview = () => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('/api/interview-questions/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.interviews);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You need to log in to access interview questions.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        '/api/interview-questions/generate',
        { company, position, jobDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(response.data.interview);
      fetchHistory(); // Refresh history after generating new questions
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching interview questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewInterviewDetails = (interview) => {
    setSelectedInterview(interview);
  };

  const renderQuestionGenerator = () => (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Job Position"
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Job Description (Optional)"
          className="border p-2 rounded w-full h-32"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition duration-300 w-full"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {questions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Interview Questions:</h2>
          <ol className="space-y-4 list-decimal list-inside">
            {questions.map((q, index) => (
              <li key={index} className="bg-white p-4 rounded shadow">
                <p className="font-bold">{q.question}</p>
                <p className="mt-2"><strong>Answer:</strong> {q.answer}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Interview History:</h2>
      {history.map((interview, index) => (
        <div key={index} className="mb-4 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">{interview.position} at {interview.company}</h3>
          <p className="text-sm text-gray-500">{new Date(interview.createdAt).toLocaleString()}</p>
          <p className="mt-2">{interview.questions.length} questions generated</p>
          <button
            onClick={() => viewInterviewDetails(interview)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );

  const renderInterviewDetails = () => (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">
        Interview Details: {selectedInterview.position} at {selectedInterview.company}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Generated on: {new Date(selectedInterview.createdAt).toLocaleString()}
      </p>
      <ol className="space-y-4 list-decimal list-inside">
        {selectedInterview.questions.map((q, index) => (
          <li key={index} className="bg-white p-4 rounded shadow">
            <p className="font-bold">{q.question}</p>
            <p className="mt-2"><strong>Answer:</strong> {q.answer}</p>
          </li>
        ))}
      </ol>
      <button
        onClick={() => setSelectedInterview(null)}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
      >
        Back to History
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Interview Question Generator</h1>

      <div className="mb-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          {showHistory ? 'Generate Questions' : 'View History'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 mb-4">{error}</p>}

      {showHistory ? (
        selectedInterview ? renderInterviewDetails() : renderHistory()
      ) : (
        renderQuestionGenerator()
      )}
    </div>
  );
};

export default Interview;