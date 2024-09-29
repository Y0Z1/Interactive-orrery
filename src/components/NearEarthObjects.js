import React from 'react';

const NearEarthObjects = ({ neos }) => {
  if (!neos.length) return <p>Loading NEO data...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">Near-Earth Objects</h2>
      <br></br>
      <table className="table-auto w-full ">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Size (km)</th>
            <th className="px-4 py-2">Potentially Hazardous</th>
            <th className="px-4 py-2">Velocity (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {neos.map((neo, index) => {
            const velocity = parseFloat(neo.close_approach_data[0]?.relative_velocity?.kilometers_per_hour);
            return (
              <tr key={index}>
                <td className="border px-4 py-2  bg-LightPurple">{neo.name}</td>
                <td className="border px-4 py-2  bg-LightPurple">{neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)}</td>
                <td className="border px-4 py-2  bg-LightPurple">{neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</td>
                <td className="border px-4 py-2  bg-LightPurple">{!isNaN(velocity) ? velocity.toFixed(2) : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NearEarthObjects;
