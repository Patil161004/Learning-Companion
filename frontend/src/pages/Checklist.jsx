import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Checklist = () => {
  const [items, setItems] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchChecklist();
  }, []);

  useEffect(() => {
    updateProgress();
  }, [items]);

  const fetchChecklist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/checklist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (err) {
      setError('Error fetching checklist');
      console.error(err);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/checklist', { title: newItemTitle }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems([...items, response.data]);
      setNewItemTitle('');
    } catch (err) {
      setError('Error adding item');
      console.error(err);
    }
  };

  const toggleItem = async (id, isCompleted) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/checklist/${id}`, { isCompleted: !isCompleted }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.map(item => item._id === id ? { ...item, isCompleted: !isCompleted } : item));
    } catch (err) {
      setError('Error updating item');
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/checklist/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      setError('Error deleting item');
      console.error(err);
    }
  };

  const updateProgress = () => {
    const completedItems = items.filter(item => item.isCompleted).length;
    const totalItems = items.length;
    const newProgress = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;
    setProgress(newProgress);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Checklist</h1>

      <div className="mb-4 bg-gray-200 rounded-full">
        <div
          className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          style={{ width: `${progress}%` }}
        >
          {progress.toFixed(0)}%
        </div>
      </div>

      <form onSubmit={addItem} className="mb-4">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="New task"
          className="border p-2 mr-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="space-y-2">
        {items.map(item => (
          <li key={item._id} className="flex items-center bg-white p-2 rounded shadow">
            <input
              type="checkbox"
              checked={item.isCompleted}
              onChange={() => toggleItem(item._id, item.isCompleted)}
              className="mr-2"
            />
            <span className={item.isCompleted ? 'line-through' : ''}>{item.title}</span>
            <button
              onClick={() => deleteItem(item._id)}
              className="ml-auto bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist;