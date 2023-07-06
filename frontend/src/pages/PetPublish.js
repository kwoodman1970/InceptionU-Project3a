import React, { useState } from 'react';
import PetGeneral from '../components/PetGeneral';
import PetRecords from '../components/PetRecords';
// import '../css/TabsRow.css';

const PetPublish = () => {
  const [petObjectId, setPetObjectId] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <>
      <h1 className='home-middel-penel fw-bold'>pet <span>cards</span></h1>

      <div className='tabsRow'>
        <div name={`${currentTab === 0}`}>General</div>
        <div name={`${currentTab === 1}`}>Records</div>
        <div name={`${currentTab === 2}`}>Contacts</div>
        <div name={`${currentTab === 3}`}>Pedigree</div>
      </div>
      <div style={{border: '1px solid black', padding: '4px'}}>
        {currentTab === 0 && <PetGeneral setCurrentTab={setCurrentTab} setPetObjectId={setPetObjectId} cardType='Supplier' />}
        {currentTab === 1 && <PetRecords setCurrentTab={setCurrentTab} petObjectId={petObjectId} />}
        {currentTab === 2 && <p>Contacts component goes here (Pet object ID is {petObjectId ? petObjectId : 'unknown'})</p>}
        {currentTab === 3 && <p>Pedigree component goes here (Pet object ID is {petObjectId ? petObjectId : 'unknown'})</p>}
      </div>
    </>);
}

export default PetPublish;
