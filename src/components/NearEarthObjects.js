import React from 'react';


const NearEarthObjects = ({ neos }) => { 
  if (!neos.length) return <p>Loading NEO data...</p>;

  return (
    <div className="mt-5 absolute z-50 w-1/8 translate-y-10 h-[83vh] overflow-scroll text-sm left-5 text-center transition-all">
      <br></br>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Near Earth Objects</th>
          </tr>
        </thead>
        <tbody>

          {neos.map((neo, index) => {
            const velocity = parseFloat(neo.close_approach_data[0]?.relative_velocity?.kilometers_per_hour);
            return (
              <tr key={index}>
                <td className="border px-4 py-2 bg-gray-500 bg-opacity-25 relative group transition-all">{neo.name}
                <td className="border px-4 py-2 hidden group-hover:block mt-3 transition-all bg-gray-300 bg-opacity-25">Diameter: {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</td>
                <td className="border px-4 py-2 hidden group-hover:block transition-all bg-gray-300 bg-opacity-25">Potentially Hazardous: {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</td>
                <td className="border px-4 py-2 hidden group-hover:block transition-all bg-gray-300 bg-opacity-25">Velocity: {!isNaN(velocity) ? velocity.toFixed(2) : 'N/A'} km/h</td>
              </td></tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
};



export default NearEarthObjects;
