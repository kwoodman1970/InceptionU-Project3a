import React from 'react';

const CustomInput = (props) => {
  const { type, label, i_id, name, i_class, onBlur, onChange, value } = props;
  return (
    <div className='form-floating  mt-3'>
      <input
        type={type}
        placeholder={label}
        id={i_id}
        value={value}
        name={name}
        className={`form-control ${i_class} align-items-center m-auto`}
        onChange={onChange}
        onBlur={onChange}
      />
      <label style={{ fontSize: '13px' }} htmlFor={label}>
        {label}
      </label>
    </div>
  );
};

export default CustomInput;
