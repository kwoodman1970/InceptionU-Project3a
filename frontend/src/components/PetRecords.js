import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import CustomInput from '../components/CustomInput';
import { updatePet, reset } from '../features/pet/petSlice';

let schema = Yup.object().shape({
  date: Yup.string().required('* Date is required'),
  treatment: Yup.string().required('* Treatment Type is required'),
});

const PetRecord = (props) => {
  const setCurrentTab = props.setCurrentTab;
  const petObjectId = props.petObjectId;

  const [records, setRecords] = useState([]);
  const [addingRecord, setAddingRecord] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reset());
  }, []);

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
      treatment: '',
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
          toast.success('Successfull added attachment');
        })
      } catch(error) {
         toast.error("Attachment not summited");
        }
  }

   return (
    <>
      <h2>record keeping</h2>
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
          id='records-form'
          onSubmit={(event) => {event.preventDefault(); return formik.handleSubmit();}}
          className='d-flex flex-column gap-10'>
          <section>
            <div className='my-2 w-100 rounded-3 mx-auto' style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
              <div>
                <CustomInput
                  type='date'
                  name='date'
                  label='Date *'
                  id='date'
                  {...formik.getFieldProps('date')}
                />
                <div className='error '>
                  {formik.touched.date && formik.errors.date ? (
                    <div>{formik.errors.date}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='treatment'
                  {...formik.getFieldProps('treatment')}>
                  <option value=''>Select Treatment Type *</option>
                  <option value='Wellness Exam'>Wellness Exam</option>
                  <option value='Vaccination'>Vaccination</option>
                  <option value='Parasite Control'>Parasite Control</option>
                  <option value='Flea/Tick Control'>Flea/Tick Control</option>
                  <option value='Fecal Exams/Deworming'>Fecal Exams/Deworming</option>
                  <option value='Nutrition & Weight'>Nutrition & Weight</option>
                  <option value='Laboratory Tests'>Laboratory Tests</option>
                  <option value='Annual Checkup'>Annual Checkup</option>
                </select>
                <div className='error '>
                  {formik.touched.treatment && formik.errors.treatment ? (
                    <div>{formik.errors.treatment}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <CustomInput
                  type='string'
                  name='medication'
                  label='Medication'
                  id='medication'
                  {...formik.getFieldProps('medication')}
                />
                <div className='error '>
                  {formik.touched.medication && formik.errors.medication ? (
                    <div>{formik.errors.medication}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <CustomInput
                  type='number'
                  name='weight'
                  label='Weight (kg)'
                  id='weight'
                  {...formik.getFieldProps('weight')}
                />
                <div className='error '>
                  {formik.touched.weight && formik.errors.weight ? (
                    <div>{formik.errors.weight}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <CustomInput
                  type='date'
                  name='dueDate'
                  label='Due Date'
                  id='date'
                  {...formik.getFieldProps('dueDate')}
                />
                <div className='error '>
                  {formik.touched.dueDate && formik.errors.dueDate ? (
                    <div>{formik.errors.dueDate}</div>
                  ) : null}
                </div>
              </div>
              {/* The following is left here for future implemention */}

              {/* <div>
                <input
                  type='checkbox'
                  id='alert'
                  name='alert'
                  defaultChecked={false}
                />
                <label style={{ fontSize: '13px' }} htmlFor='alert'>
                  &nbsp;Alert
                </label>
              </div> */}
              <div>
                <CustomInput
                  type='string'
                  name='note'
                  label='Notes'
                  id='note'
                  {...formik.getFieldProps('note')}
                />
                <div className='error '>
                  {formik.touched.note && formik.errors.note ? (
                    <div>{formik.errors.note}</div>
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

      <div>
        <table className='list-data'>
          <caption>medical records</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Treatment Type</th>
              <th>Medication</th>
              <th style={{textAlign: 'center'}}>Weight</th>
              <th>Due Date</th>
              <th>Attachment</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
          {records?.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.treatment}</td>
              <td>{record.medication}</td>
              <td style={{textAlign: 'center'}}>
                {(record.weight !== '') && (Number(record.weight).toFixed(1) + 'kg')}</td>
              <td>{record.dueDate}</td>
              <td><label className='button border-0'> + add
                <input style={{display:'none'}} type='file' accept='.xls,.csv,.pdf,.doc,.docx,.jpg,.jpeg,.png' onChange={uploadDocument} />
                </label></td>
              <td>{record.note}</td>
            </tr>
          ))}
          </tbody>
        </table>
        <br />
        <div className='d-flex flex-wrap post-button gap-3'>
          <button type='submit' className='button border-0' onClick={submitRecords}>
            Save
          </button>
          <Link className='button  border-0 ' to='/supplier'>
            Delete
          </Link>
        </div>
      </div>
    </>
  );
};

export default PetRecord;
