import neosData from './data.json'; // Update with the actual path to your JSON file

export const fetchNEOs = () => {
  try {
    // NASA API returns NEOs under the 'near_earth_objects' key, where dates are subkeys
    const neoDateKey = Object.keys(neosData.near_earth_objects)[0]; // e.g., '2023-09-21'
    const neo = neosData.near_earth_objects[neoDateKey]; // Return array of NEOs for that date
    return neo
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    return [];
  }
};
