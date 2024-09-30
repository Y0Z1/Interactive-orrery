import React, { useState, useEffect } from 'react';
import Orrery from './components/Orrery';
import NearEarthObjects from './components/NearEarthObjects';
import { fetchNEOs } from './api/nasaApi'; // Fetches NEO data from the NASA API

function App() {
  const [neoData, setNeoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNEOs();
      setNeoData(data);
    };
    fetchData();
  }, []);

  return (
    <div className= "m-auto p-4 bg-Black text-white font-outfit w-auto h-auto">
      <PopupNEO neoData={neoData} />
    <h1 className="text-3xl font-bold mb-6 text-center">Interactive Orrery</h1>
    {/* Render the orrery with NEO data */}
      <Orrery neos={neoData} />
    </div>
  );
}

function PopupNEO (neoData) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(prevState => !prevState);  // Toggle between true and false
  };

  const closeModal = () => {
    setShowModal(false);  // Ensure modal can be closed when clicking outside
  };
  
  return (
    <div className="App m-4">
      <button onClick={toggleModal}>Near Earth Objects</button>
      <Modal show={showModal} onClose={closeModal}/>
    </div>
  )
}

const Modal = ({ show , onClose }) => {
  const [neoData, setNeoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNEOs();
      setNeoData(data);
    };
    fetchData();
  }, []);

  if (!show) return null; // Don't render if `show` is false

  return (
  <>
    <NearEarthObjects neos={neoData} />
  </>
  );
};

export default App;
