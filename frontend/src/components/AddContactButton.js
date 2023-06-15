import React from 'react';
import '../css/AddContactButton.css'

function AddContactButton({onAddContact}) {
  const handleAddContact = () => {
    // Logic for adding contact data
    // console.log('Add contact clicked!');
    onAddContact();
  };

  return (
    <div>
      <button id="addContactButton" onClick={handleAddContact}>
        + Add Contact
      </button>
    </div>
  );
}

export default AddContactButton;
