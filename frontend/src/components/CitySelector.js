import React from 'react';

const CitySelector = ({ city, setCity }) => {
  return (
    <div>
      <label htmlFor="city">Select city: </label>
      <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
        <option value="Helsinki">Helsinki</option>
        <option value="Espoo">Espoo</option>
        <option value="Vantaa">Vantaa</option>
      </select>
    </div>
  );
};

export default CitySelector;