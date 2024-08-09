import React from 'react';

const DraggableItem = ({ item, deleteItem }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  return (
    <div
      className={`draggable-item p-4 m-2 rounded-md shadow-md cursor-pointer ${item.status === 'completed' ? 'bg-green-500' : item.status === 'inProcess' ? 'bg-blue-500' : 'bg-red-500'} text-white relative`}
      draggable
      onDragStart={handleDragStart}
    >
      {item.status === 'deleted' && (
        <button
          onClick={() => deleteItem(item._id)}
          className="absolute top-2 right-2 bg-red-700 hover:bg-red-900 text-white font-bold py-1 px-2 rounded"
        >
          Delete Permanently
        </button>
      )}
      <p className="font-bold">{item.name}</p>
      <p>{item.info}</p>
    </div>
  );
};

export default DraggableItem;
