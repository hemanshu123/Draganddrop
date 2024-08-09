// DropArea.js
import React from 'react';
import axios from 'axios';

const DropArea = ({ droppedItems, setDroppedItems, setItems }) => {
  const handleDrop = async (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('item'));
    setDroppedItems([...droppedItems, { ...item, status: 'inProcess' }]);

    // Remove the item from the draggable items list
    setItems(prevItems => prevItems.filter(i => i._id !== item._id));

    // Save item to the backend
    await axios.post('http://localhost:5000/api/items', { ...item, status: 'inProcess' });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemove = async (id) => {
    const itemToRemove = droppedItems.find(item => item._id === id);
    setDroppedItems(droppedItems.filter(item => item._id !== id));
    setItems(prevItems => [...prevItems, itemToRemove]); // Add back to the draggable items list

    // Remove item from the backend
    await axios.delete(`http://localhost:5000/api/items/${id}`);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="drop-area w-full h-64 border-2 border-dashed border-gray-300 flex items-center justify-center mt-4 rounded-md bg-white text-black overflow-auto"
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Drag Items</h2>
        <div className="flex flex-wrap">
          {droppedItems.length > 0 ? (
            droppedItems.map((item) => (
              <div
                key={item._id}
                className={`dropped-item p-4 m-2 rounded-md shadow-md ${item.status === 'deleted' ? 'bg-red-500' : 'bg-green-500'} text-white`}
              >
                <p className="font-bold">{item.name}</p>
                <p>{item.info}</p>
                {item.status === 'deleted' && (
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="bg-red-700 hover:bg-red-900 text-white font-bold py-1 px-2 rounded mt-2"
                  >
                    Delete Permanently
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No items here. Drag and drop items to this area.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropArea;
