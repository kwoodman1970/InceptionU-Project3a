import React from 'react';
import '../css/ToggleSwitch.css';

const ToggleSwitch = ({ id, isActive, onToggleChange }) => {
  const handleChange = () => {
    onToggleChange(!isActive);
  };

  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id={id}
        checked={isActive}
        onChange={handleChange}
      />
      <label htmlFor={id} className="toggle-label">
        <span className="toggle-text">{isActive ? 'Yes' : 'No'}</span>
        <span className="toggle-handle"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
