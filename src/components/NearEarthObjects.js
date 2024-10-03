import React from 'react';

const NearEarthObjects = ({ neos , handleOverlayClick , handleContentClick }) => {
  if (!neos.length) return <p>Loading NEO data...</p>;

  return (
    <div className="mt-5 absolute z-50 w-full h-800px overflow-scroll text-sm left-5 text-center transition-all">
      <br></br>
      <table className="table-auto w-1/8">
        <thead>
          <tr>
            <th className="px-4 py-2">NEOs</th>
          </tr>
        </thead>
        <tbody>

          {neos.map((neo, index) => {
            const velocity = parseFloat(neo.close_approach_data[0]?.relative_velocity?.kilometers_per_hour);
            return (
              
              <tr key={index}>
                <td className="border px-4 py-2 bg-gray-500 bg-opacity-25 relative group">{neo.name}
                <div className="absolute left-full w-full translate-x-1 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white p-1">
                <td>Diameter: {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</td>
                <td>Potentially Hazardous: {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</td>
                <div>Velocity: {!isNaN(velocity) ? velocity.toFixed(2) : 'N/A'} km/h</div>
              </div></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NearEarthObjects;
