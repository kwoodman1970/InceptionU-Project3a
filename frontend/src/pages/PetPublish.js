import React, { useState } from 'react';
import PetGeneral from '../components/PetGeneral';
// import '../css/TabsRow.css';

const PetPublish = () => {
  const [petObjectId, setPetObjectId] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <>
      <h4 className=' mt-0'>Post Your Pet</h4>
      <p className=' mb-0'>Please fill all information to process!</p>

      <div className='tabsRow'>
        <div name={`${currentTab === 0}`}>General</div>
        <div name={false}>Records</div>
        <div name={`${currentTab === 1}`}>Contacts</div>
        <div name={`${currentTab === 2}`}>Pedigree</div>
      </div>
      <div style={{border: '1px solid black', padding: '4px'}}>
        {currentTab === 0 && <PetGeneral setCurrentTab={setCurrentTab} cardType='Supplier' setPetObjectId={setPetObjectId} />}
        {currentTab === 2 && <p>Pet object is {petObjectId ? petObjectId : 'unknown'}</p>}
        {currentTab === 3 && <p>Pet object is {petObjectId ? petObjectId : 'unknown'}</p>}
        {currentTab === 4 && <p>Pet object is {petObjectId ? petObjectId : 'unknown'}</p>}
      </div>
    </>);
}

export default PetPublish;
