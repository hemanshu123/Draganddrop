import React, { useState } from 'react';

const AddItemForm = ({ addItem, toggleForm }) => {
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem({ name, info });
    setName('');
    setInfo('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={toggleForm}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        >
          ✖
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center">Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="info">
              Item Information
            </label>
            <textarea
              id="info"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;
