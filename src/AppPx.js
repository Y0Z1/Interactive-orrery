import React, { useState, useEffect } from 'react';
import OrreryPx from './components/OrreryPx';
import NearEarthObjects from './components/NearEarthObjects';
import { fetchNEOs } from './api/nasaApi'; // Fetches NEO data from the NASA API

function AppPx() {
  const [neoData, setNeoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNEOs();
      setNeoData(data);
    };
    fetchData();
  }, []);

  return (
    <div className= "m-auto p-4 bg-Black text-white font-p2p w-auto h-auto">
      <PopupNEO neoData={neoData} />
    <h1 className="text-xl -translate-y-4 font-bold mb-6 text-center no-select">Interactive Orrery</h1>
    {/* Render the orrery with NEO data */}
      <OrreryPx neos={neoData} />
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
      <div onClick={toggleModal} className='absolute '><Button text={'Near Earth Objects'}/></div>
      <div className='text-right font-outfit'><ButtonPX text={"Realistic Mode"} page={'/'}/></div>
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

function Button({text}){
  return(    
     <div class="relative inline-flex group">
     <div
         class="absolute transitiona-all duration-1000 opacity-50 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
     </div>
     <div title="Just Click"
         class="relative no-select inline-flex items-center justify-center px-8 py-4 text-md hover:text-lg hover:font-bold text-white transition-all duration-200 bg-gray-900 hover:bg-gray-800 font-p2p rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
         role="button">{text}
     </div>
 </div>)
 }

function ButtonPX({text,page}){
  return(    
     <div class="relative inline-flex group">
     <div
         class="absolute transitiona-all duration-1000 opacity-50 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
     </div>
     <a href={page} title="Realistic"
         class="relative inline-flex items-center justify-center px-8 py-4 text-lg hover:text-xl hover:font-semibold text-white transition-all duration-200 bg-gray-900 hover:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
         role="button">{text}
     </a>
 </div>)
}

export default AppPx;
