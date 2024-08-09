import React from 'react';
import DraggableItem from './DraggableItem';
import axios from 'axios';

const DraggableItemContainer = ({ items, setItems, title, onItemDrop }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedItem = JSON.parse(e.dataTransfer.getData('item'));
    onItemDrop(droppedItem);
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this item?")) {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      setItems(prevItems => prevItems.filter(item => item._id !== id));
    }
  };

  return (
    <div
      className="draggable-item-container w-full h-auto max-h-96 overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-white border border-black p-4 rounded-md shadow-md h-auto">
        {items.length > 0 ? (
          items.map((item) => (
            <DraggableItem key={item._id} item={item} deleteItem={deleteItem} />
          ))
        ) : (
          <p>No items available.</p>
        )}
      </div>
    </div>
  );
};

export default DraggableItemContainer;
