import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../layout/NavBar';

export default function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    inputFormat: '',
    outputFormat: '',
    constraints: [''],
    tags: [''],
    points: 0,
    testCases: [{ input: '', expectedOutput: '' }],
    examples: [{ input: '', output: '' }]
  });

  const fetchProblem = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/problems/${id}`, {
        withCredentials: true,
      });
      setFormData(res.data);
    } catch (err) {
      console.error('Update error:', err);
    
      if (err.response?.data?.error) {
        alert(err.response.data.error); // e.g., "Another problem with this title already exists"
      } else if (err.message) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred while updating the problem.');
      }
    }
    
  };

  useEffect(() => {
    fetchProblem();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleArrayChange = (field, idx, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[idx][key] = value;
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const handleSimpleArrayChange = (field, idx, value) => {
    const updated = [...formData[field]];
    updated[idx] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const addField = (field, template) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  const removeField = (field, idx) => {
    const updated = [...formData[field]];
    updated.splice(idx, 1);
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8000/api/problems/${id}`, formData, {
        withCredentials: true,
      });
      alert('Problem updated successfully');
      navigate('/admin/manageproblems');
    } 
  catch (err) {
    console.error('Update error:', err);
  
    if (err.response && err.response.data?.error) {
      alert(err.response.data.error); 
    } else {
      alert(`Error updating problem: ${err.message}`);
    }
  }
  
  };

  return (
    <>
    <NavBar />
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows="5" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Difficulty</label>
          <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Points</label>
          <input type="number" name="points" value={formData.points} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Input Format</label>
          <input type="text" name="inputFormat" value={formData.inputFormat} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Output Format</label>
          <input type="text" name="outputFormat" value={formData.outputFormat} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        {/* Constraints */}
        <div>
          <label className="block font-semibold mb-1">Constraints</label>
          {formData.constraints.map((c, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={c}
                onChange={(e) => handleSimpleArrayChange('constraints', idx, e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              {idx > 0 && (
                <button type="button" onClick={() => removeField('constraints', idx)} className="text-red-600 text-sm">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addField('constraints', '')} className="text-blue-600 text-sm mt-1">+ Add Constraint</button>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold mb-1">Tags</label>
          {formData.tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleSimpleArrayChange('tags', idx, e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              {idx >= 0 && (
                <button type="button" onClick={() => removeField('tags', idx)} className="text-red-600 text-sm">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addField('tags', '')} className="text-blue-600 text-sm mt-1">+ Add Tag</button>
        </div>

        {/* Test Cases */}
        <div>
          <label className="block font-semibold mb-1">Test Cases</label>
          {formData.testCases.map((tc, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded bg-gray-50">
              <input
                type="text"
                placeholder="Input"
                value={tc.input}
                onChange={(e) => handleArrayChange('testCases', idx, 'input', e.target.value)}
                className="w-full border px-3 py-2 mb-2 rounded"
              />
              <input
                type="text"
                placeholder="Expected Output"
                value={tc.expectedOutput}
                onChange={(e) => handleArrayChange('testCases', idx, 'expectedOutput', e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              {idx > 0 && (
                <button type="button" onClick={() => removeField('testCases', idx)} className="text-red-600 text-sm mt-1">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addField('testCases', { input: '', expectedOutput: '' })} className="text-blue-600 text-sm mt-1">+ Add Test Case</button>
        </div>

        {/* Examples */}
        <div>
          <label className="block font-semibold mb-1">Examples</label>
          {formData.examples.map((ex, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded bg-gray-50">
              <input
                type="text"
                placeholder="Example Input"
                value={ex.input}
                onChange={(e) => handleArrayChange('examples', idx, 'input', e.target.value)}
                className="w-full border px-3 py-2 mb-2 rounded"
              />
              <input
                type="text"
                placeholder="Example Output"
                value={ex.output}
                onChange={(e) => handleArrayChange('examples', idx, 'output', e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              {idx > 0 && (
                <button type="button" onClick={() => removeField('examples', idx)} className="text-red-600 text-sm mt-1">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addField('examples', { input: '', output: '' })} className="text-blue-600 text-sm mt-1">+ Add Example</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Problem</button>
      </form>
    </div>
    </>
  );
}
