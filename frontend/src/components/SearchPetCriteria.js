import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import CustomInput from '../components/CustomInput';
import { updatePet, reset } from '../features/pet/petSlice';
import { getSpecies } from '../features/species/speicesSlice';

let schema = Yup.object().shape({
  date: Yup.string().required('* Date is required'),
  treatment: Yup.string().required('* Treatment Type is required'),
});

const SearchPetCriteria = (props) => {
  const setCurrentTab = props.setCurrentTab;
  const petObjectId = props.petObjectId;
  const speciesState = useSelector((state) => state.species.species);
  const [breeds, setBreeds]= useState(['Select Breed *']);
  const [records, setRecords] = useState([]);
  const [addingRecord, setAddingRecord] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSpecies());
    dispatch(reset());
  }, []);

  function updateForm(changedElement) {
    if (changedElement.target.name === 'species') {
      const species   = changedElement.target.value;
      const newBreeds = speciesState.find((element) => element.name === species)?.breeds;

      setBreeds(newBreeds ? newBreeds : []);
    }
  }

  // const { isError, isSuccess, isLoading, createdPet: createdRecords, message } = newPet;

  // useEffect(() => {
  //   if (isSuccess && createdRecords) {
  //     toast.success('Successfull added records');
  //     dispatch(resetState());
  //   }

  //   if (isError) {
  //     toast.error(message);
  //     dispatch(resetState());
  //   }
  // }, [isSuccess, isError, isLoading, createdRecords, dispatch, message]);

  const formik = useFormik({
    initialValues: {
      date: '',
      maxPrice: '',
      alert: false,
      medication: '',
      weight: '',
      dueDate: '',
      note: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      // The following is left here for future implemention
      // values.alert = document.getElementById('alert').checked;

      const newRecords = [...records, values];

      setRecords(newRecords);
      setAddingRecord(false);
    },
  });

  const submitRecords = async () => {
    try {
      const updatedPet = dispatch(updatePet({petObjectId, data: {records}}));
      updatedPet.then((response) => {
        if (response.error) {
          toast.error(response.payload);
        } else {
          setCurrentTab((currentTab) => currentTab + 1);
          toast.success('Successfull added records');
        }
      });

      // formik.resetForm();
      // dispatch(resetState());
      // setTimeout(() => {
      //   navigate('/supplier/all-pets');
      // }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadDocument(element) {
    const API_URL = '/api/docs/';
    const formData = new FormData();
    const index = parseInt(element.target.id.substring(14)); // "AddAttachment_i"

    formData.append('attachment', element.target.files[0]);
    try {
      await axios
        .post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          console.log(`Adding "${res.data.name} to record ${index}`);
          records[index].attachment = res.data.name;

          /* TODO:  replace DOM-based visibility with React-ish visibility */

          const buttonElement = document.getElementById(`AddButton_${index}`);
          const doneElement = document.getElementById(`Done_${index}`);

          buttonElement.style.display = 'none';
          doneElement.style.display = 'block';

          toast.success('Successfull added attachment');
        })
      } catch(error) {
         toast.error("Attachment not summited");
        }
  }

   return (
    <>
      <h2>find a pet</h2>
      {/* The following commented-out sections are left here for future implemention */}

      {/* <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
        <table className='list-data'>
          <caption style={{backgroundColor: 'red'}}>alerts</caption>
          <tbody>
            {records?.map((record, index) => (
              (record.alert &&
              <tr key={index}>
                <td>{record.dueDate}</td>
                <td>{record.treatment}</td>
              </tr>
            )))}
          </tbody>
        </table>
        <table className='list-data'>
          <caption>current medications</caption>
          <tbody>
            {records?.map((record, index) => (
              record.medication && <tr key={index}>
                <td>{record.medication}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* <div id='add-record-button' style={{textAlign: 'right', display: (!addingRecord ? 'block' : 'none')}}>
        <button onClick={() => {setAddingRecord(true)}}>+ Add Another Record</button>
      </div> */}

      {/* <div style={{display: (addingRecord ? 'block' : 'none')}}> */}
      <div>
        <form
          className='d-flex flex-column gap-10'
          onChange={updateForm}>
          <section>
            <div className='my-2 w-100 rounded-3 mx-auto' style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
              <div>
                <CustomInput
                  type='text'
                  name='postalCode'
                  label='Where are you located? Enter Postal Code'
                  id='postal-code'
                  {...formik.getFieldProps('postalCode')}
                />
                <div className='error '>
                  {formik.touched.postalCode && formik.errors.postalCode ? (
                    <div>{formik.errors.postalCode}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='maxDistance'
                  {...formik.getFieldProps('maxDistance')}>
                  <option value='20000'>How far are you willing to teavel to get your pet?</option>
                  <option value='5'>5 km</option>
                  <option value='10'>10 km</option>
                  <option value='25'>25 km</option>
                  <option value='50'>50 km</option>
                  <option value='100'>100 km</option>
                  <option value='250'>250 km</option>
                  <option value='500'>500 km</option>
                </select>
                <div className='error '>
                  {formik.touched.maxPrice && formik.errors.maxPrice ? (
                    <div>{formik.errors.maxPrice}</div>
                  ) : null}
                </div>
                </div>
                <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='maxPrice'
                  {...formik.getFieldProps('maxPrice')}>
                  <option value='1000000000'>How much do you want to pay for your pet?</option>
                  <option value='100'>$100</option>
                  <option value='1000'>$1000</option>

                </select>
                <div className='error '>
                  {formik.touched.maxPrice && formik.errors.maxPrice ? (
                    <div>{formik.errors.maxPrice}</div>
                  ) : null}
                </div>
                </div>
                <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='species'
                  {...formik.getFieldProps('species')}>
                  <option value=''>What pet species are you looking for?</option>

                  {speciesState.map((species, index) => {
                    return (
                      <option key={index} value={species.name}>
                        {species.name}
                      </option>
                    );
                  })}
                </select>
                <div className='error '>
                  {formik.touched.species && formik.errors.species ? (
                    <div>{formik.errors.species}</div>
                  ) : null}
                </div>
                </div>
                <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='breed'
                  {...formik.getFieldProps('breed')}>
                  <option value=''>Are you looking for a specific breed?</option>

                  {breeds.map((breed, index) => {
                    return (
                      <option key={index} value={breed.name}>
                        {breed.name}
                      </option>
                    );
                  })}
                </select>
                <div className='error '>
                  {formik.touched.breed && formik.errors.breed ? (
                    <div>{formik.errors.breed}</div>
                  ) : null}
                </div>
                </div>

                <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='sex'
                  {...formik.getFieldProps('sex')}>
                  <option value='No Preference'>What sex are you looking for?</option>
                  <option value='No Preference'>No Preference</option>
                  <option value='Unknown'>Unknown</option>
                  <option value='Female'>Female</option>
                  <option value='Male'>Male</option>
                </select>
                <div className='error '>
                  {formik.touched.sex && formik.errors.sex ? (
                    <div>{formik.errors.sex}</div>
                  ) : null}
                </div>
              </div>
            </div>
            </section>
            <div className='d-flex flex-wrap post-button gap-3'>
            <button type='submit' className='button border-0'>
              Add
            </button>
            <Link className='button  border-0 ' to='/supplier'>
              Clear
            </Link>
          </div>
        </form>
      </div>
      <br />
    </>
  );
};

export default SearchPetCriteria;
