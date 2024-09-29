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
    <div className= "mx-auto p-4 bg-DarkPurple text-white font-outfit">
      <h1 className="text-3xl font-bold mb-6 text-center">Interactive Orrery & Near-Earth Objects</h1>
      {/* Render the orrery with NEO data */}
      <Orrery neos={neoData} />
      {/* Render Near-Earth Objects List */}
      <NearEarthObjects neos={neoData} />
    </div>
  );
}

export default App;
