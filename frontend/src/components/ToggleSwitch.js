import React from 'react';
import '../css/ToggleSwitch.css';

const ToggleSwitch = ({ isActive, onToggleChange }) => {
  const handleChange = () => {
    onToggleChange(!isActive);
  };

  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id="switch"
        checked={isActive}
        onChange={handleChange}
      />
      <label htmlFor="switch" className="toggle-label">
        <span className="toggle-text">{isActive ? 'Yes' : 'No'}</span>
        <span className="toggle-handle"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;






