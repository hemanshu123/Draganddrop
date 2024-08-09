import React from 'react';

const NavBar = ({ toggleForm, logout, username }) => {
  return (
    <nav className="bg-gradient-to-r from-black to-blue-500 p-4 flex justify-between items-center w-full shadow-lg">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleForm}
          className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-105 flex items-center"
        >
          <span role="img" aria-label="add" className="mr-2">➕</span> Create Item
        </button>
        <div className="text-white font-bold">
          Welcome, {username}!
        </div>
      </div>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-105"
      >
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
