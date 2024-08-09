import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    };

    fetchItems();
  }, []);

  return (
    <div className="item-list mt-8">
      {items.map((item, index) => (
        <div key={index} className="list-item p-4 m-2 bg-gray-200 rounded-md shadow-md">
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
