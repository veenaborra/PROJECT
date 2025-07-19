import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../layout/NavBar';

export default function AddProblem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    tags: '',
    points: 0,
    inputFormat: '',
    outputFormat: '',
    constraints: [''],
    testCases: [{ input: '', expectedOutput: '' }],
    examples: [{ input: '', output: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'difficulty') {
      let points = 0;
      if (value === 'Easy') points = 10;
      else if (value === 'Medium') points = 25;
      else if (value === 'Hard') points = 50;
  
      setFormData((prev) => ({
        ...prev,
        difficulty: value,
        points, // auto-update points
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleArrayChange = (field, index, key, value) => {
    const updated = [...formData[field]];
    updated[index][key] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const handleConstraintChange = (index, value) => {
    const updated = [...formData.constraints];
    updated[index] = value;
    setFormData(prev => ({ ...prev, constraints: updated }));
  };

  const addField = (field, template) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], template],
    }));
  };

  const removeField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
    };

    try {
      await axios.post('http://localhost:8000/api/problems', payload, { withCredentials: true });
      alert('Problem added successfully!');
      navigate('/admin/manageproblems');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.error) {
        alert(err.response.data.error); 
      } else {
        alert('Failed to add problem. Please try again.');
      }
    }
  };

  return (
    <div>
    <NavBar />
    <div className="mx-auto max-w-4xl p-6 bg-white border border-gray-200 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Add New Problem</h2>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            name="title"
            placeholder="e.g. Two Sum"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
  
        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            placeholder="e.g. Given an array of integers, return indices of the two numbers..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
  
        {/* Difficulty */}
        <div>
          <label className="block mb-1 font-semibold">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
  
        {/* Tags */}
        <div>
          <label className="block mb-1 font-semibold">Tags</label>
          <input
            name="tags"
            placeholder="e.g. arrays, hashmaps"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
  
        {/* Points */}
        <div>
          <label className="block mb-1 font-semibold">Points</label>
          <input
            type="number"
            name="points"
            placeholder="e.g. 100"
            value={formData.points}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
  
        {/* Input Format */}
        <div>
          <label className="block mb-1 font-semibold">Input Format</label>
          <input
            name="inputFormat"
            placeholder="e.g. First line contains an integer N..."
            value={formData.inputFormat}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
  
        {/* Output Format */}
        <div>
          <label className="block mb-1 font-semibold">Output Format</label>
          <input
            name="outputFormat"
            placeholder="e.g. Print the sum of two numbers"
            value={formData.outputFormat}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
  
        {/* Constraints */}
        <div>
          <label className="block mb-1 font-semibold">Constraints</label>
          {formData.constraints.map((val, idx) => (
            <div key={idx} className="flex gap-2 my-2">
              <input
                type="text"
                placeholder="e.g. 1 ≤ N ≤ 10^5"
                value={val}
                onChange={(e) => handleConstraintChange(idx, e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
              />
              {idx > 0 && (
                <button type="button" onClick={() => removeField('constraints', idx)} className="text-red-500">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addField('constraints', '')} className="text-blue-600 text-sm">
            + Add Constraint
          </button>
        </div>
  
        {/* Test Cases */}
    
        <div>
  <label className="block mb-2 font-semibold text-gray-700">Test Cases</label>

  {formData.testCases.map((tc, idx) => (
    <div key={idx} className="border rounded p-4 mb-3 bg-gray-50">
      <div className="mb-3">
        <label className="block mb-1 font-medium text-sm text-gray-700">Input</label>
        <input
          type="text"
          placeholder="e.g. 2 7 11 15"
          value={tc.input}
          onChange={(e) => handleArrayChange('testCases', idx, 'input', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-medium text-sm text-gray-700">Expected Output</label>
        <input
          type="text"
          placeholder="e.g. 0 1"
          value={tc.expectedOutput}
          onChange={(e) => handleArrayChange('testCases', idx, 'expectedOutput', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {idx > 0 && (
        <button
          type="button"
          onClick={() => removeField('testCases', idx)}
          className="text-red-500 text-sm hover:underline"
        >
          Remove Test Case
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() => addField('testCases', { input: '', expectedOutput: '' })}
    className="text-blue-600 text-sm hover:underline"
  >
    + Add Test Case
  </button>
</div>

  
<div>
  <label className="block mb-2 font-semibold text-gray-700">Examples</label>

  {formData.examples.map((ex, idx) => (
    <div key={idx} className="border rounded p-4 mb-3 bg-gray-50">
      <div className="mb-3">
        <label className="block mb-1 font-medium text-sm text-gray-700">Input</label>
        <input
          type="text"
          placeholder="e.g. 5 10"
          value={ex.input}
          onChange={(e) => handleArrayChange('examples', idx, 'input', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-medium text-sm text-gray-700">Output</label>
        <input
          type="text"
          placeholder="e.g. 15"
          value={ex.output}
          onChange={(e) => handleArrayChange('examples', idx, 'output', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {idx > 0 && (
        <button
          type="button"
          onClick={() => removeField('examples', idx)}
          className="text-red-500 text-sm hover:underline"
        >
          Remove Example
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() => addField('examples', { input: '', output: '' })}
    className="text-blue-600 text-sm hover:underline"
  >
    + Add Example
  </button>
</div>

  
        {/* Submit */}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add Problem
        </button>
      </form>
    </div>
  </div>
  
  );
}
