import React, { useState } from 'react';
import PetGeneral from '../components/PetGeneral';
import PetRecords from '../components/PetRecords';
// import '../css/TabsRow.css';

const PetPublish = () => {
  const [petObjectId, setPetObjectId] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <>
      <PetRecords petObjectId='64907d5cf089b3a0e8ea61a3' setCurrentTab={setCurrentTab} />

      <h1 className='home-middel-penel fw-bold'>pet <span>cards</span></h1>

      <div className='tabsRow'>
        <div name={`${currentTab === 0}`}>General</div>
        <div name={`${false}`}>Records</div>
        <div name={`${currentTab === 1}`}>Contacts</div>
        <div name={`${currentTab === 2}`}>Pedigree</div>
      </div>
      <div style={{border: '1px solid black', padding: '4px'}}>
        {currentTab === 0 && <PetGeneral cardType='Supplier' setCurrentTab={setCurrentTab} setPetObjectId={setPetObjectId} />}
        {currentTab === -1 && <p>Records component goes here (Pet object ID is {petObjectId ? petObjectId : 'unknown'})</p>}
        {currentTab === 1 && <p>Contacts component goes here (Pet object ID is {petObjectId ? petObjectId : 'unknown'})</p>}
        {currentTab === 2 && <p>Pedigree component goes here (Pet object ID is {petObjectId ? petObjectId : 'unknown'})</p>}
      </div>
    </>);
}

export default PetPublish;
