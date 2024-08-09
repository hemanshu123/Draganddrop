import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DraggableItemContainer from './components/DraggableItemContainer';
import AddItemForm from './components/AddItemForm';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';

const App = () => {
  const [itemsInProcess, setItemsInProcess] = useState([]);
  const [itemsCompleted, setItemsCompleted] = useState([]);
  const [itemsDeleted, setItemsDeleted] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      if (user) {
        const [inProcessResponse, completedResponse, deletedResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/items/${user._id}/inProcess`),
          axios.get(`http://localhost:5000/api/items/${user._id}/completed`),
          axios.get(`http://localhost:5000/api/items/${user._id}/deleted`),
        ]);
        setItemsInProcess(inProcessResponse.data);
        setItemsCompleted(completedResponse.data);
        setItemsDeleted(deletedResponse.data);
      }
    };

    fetchItems();
  }, [user]);

  const addItem = async (item) => {
    const response = await axios.post('http://localhost:5000/api/items', { ...item, userId: user._id, status: 'inProcess' });
    setItemsInProcess([...itemsInProcess, response.data]);
    setShowForm(false);
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this item?")) {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      setItemsInProcess(itemsInProcess.filter(item => item._id !== id));
      setItemsCompleted(itemsCompleted.filter(item => item._id !== id));
      setItemsDeleted(itemsDeleted.filter(item => item._id !== id));
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSetUser = async (username) => {
    const response = await axios.post('http://localhost:5000/api/users', { username });
    const user = response.data;
    setUser(user);

    const [inProcessResponse, completedResponse, deletedResponse] = await Promise.all([
      axios.get(`http://localhost:5000/api/items/${user._id}/inProcess`),
      axios.get(`http://localhost:5000/api/items/${user._id}/completed`),
      axios.get(`http://localhost:5000/api/items/${user._id}/deleted`),
    ]);
    setItemsInProcess(inProcessResponse.data);
    setItemsCompleted(completedResponse.data);
    setItemsDeleted(deletedResponse.data);
  };

  const logout = () => {
    setUser(null);
    setItemsInProcess([]);
    setItemsCompleted([]);
    setItemsDeleted([]);
  };

  const handleItemDrop = async (item, newStatus) => {
    const updatedItem = { ...item, status: newStatus };
    await axios.put(`http://localhost:5000/api/items/${item._id}`, updatedItem);

    if (newStatus === 'inProcess') {
      setItemsInProcess([...itemsInProcess, updatedItem]);
      setItemsCompleted(itemsCompleted.filter(i => i._id !== item._id));
      setItemsDeleted(itemsDeleted.filter(i => i._id !== item._id));
    } else if (newStatus === 'completed') {
      setItemsCompleted([...itemsCompleted, updatedItem]);
      setItemsInProcess(itemsInProcess.filter(i => i._id !== item._id));
      setItemsDeleted(itemsDeleted.filter(i => i._id !== item._id));
    } else if (newStatus === 'deleted') {
      setItemsDeleted([...itemsDeleted, updatedItem]);
      setItemsInProcess(itemsInProcess.filter(i => i._id !== item._id));
      setItemsCompleted(itemsCompleted.filter(i => i._id !== item._id));
    }
  };

  if (!user) {
    return <LoginForm setUser={handleSetUser} />;
  }

  return (
    <div className="app flex flex-col items-center">
      <NavBar toggleForm={toggleForm} logout={logout} username={user.username} />
      {showForm && <AddItemForm addItem={addItem} toggleForm={toggleForm} />}
      <div className="flex flex-row mt-8 w-full max-w-6xl">
        <div className="w-1/3 p-4">
          <DraggableItemContainer
            items={itemsInProcess}
            setItems={setItemsInProcess}
            title="In Process"
            onItemDrop={(item) => handleItemDrop(item, 'inProcess')}
          />
        </div>
        <div className="w-1/3 p-4">
          <DraggableItemContainer
            items={itemsCompleted}
            setItems={setItemsCompleted}
            title="Completed"
            onItemDrop={(item) => handleItemDrop(item, 'completed')}
          />
        </div>
        <div className="w-1/3 p-4">
          <DraggableItemContainer
            items={itemsDeleted}
            setItems={setItemsDeleted}
            title="Blocked"
            onItemDrop={(item) => handleItemDrop(item, 'deleted')}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
