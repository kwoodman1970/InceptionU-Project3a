import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import CustomInput from '../components/CustomInput';
import { updatePet, reset, resetState } from '../features/pet/petSlice';

let schema = Yup.object().shape({
  date: Yup.string().required('* Date is required'),
  treatment: Yup.string().required('* Treatment Type is required'),
});

const PetRecord = (props) => {
  const setCurrentTab = props.setCurrentTab;
  const petObjectId = props.petObjectId;

  const [addingRecord, setAddingRecord] = useState(false);
  const [records, setRecords] = useState([]);

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(reset());
  // }, []);

  const API_URL = '/api/img/';
  const supplierState = useSelector((state) => state.supplier.supplier);
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
    onSubmit: async (values) => {
      try {
        console.log('Adding record...');
        console.log(values);
        const newRecords = [...records, values];
        setRecords(newRecords);
        // setRecords((currentRecords) => {currentRecords.push(values); console.log(currentRecords); return currentRecords;});
        // setAddingRecord(false);

        // const updatedPet = dispatch(updatePet(values));
        // updatedPet.then((response) => {
        //   if (response.meta.requestStatus === 'fulfilled') {
        //     setCurrentTab((currentTab) => currentTab + 1);
        //     petObjectId(response.payload._id);
        //   }
        // });
        // console.log(createdPet);

        // formik.resetForm();
        // dispatch(resetState());
        // setTimeout(() => {
        //   navigate('/supplier/all-pets');
        // }, 1000);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
        <section>
          <p>alerts</p>
          <table>
            <tbody>
              {records?.map(record => (
                <tr>
                  <td>{record.dueDate}</td>
                  <td>{record.treatment}</td>
                </tr>
              ))}
              {/* records.find((element) => element?.alert)
              .forEach((element) => <tr><td>{element.dueDate}</td><td>{element.treatment}</td></tr>) */}
            </tbody>
          </table>
        </section>
        <section>
          <p>current medications</p>
          <table>
            <tbody>
              {records?.map(record => (
                record.medication && <tr>
                  <td>{record.medication}</td>
                </tr>
              ))}
              {/* records.find((element) => element?.medication !== '')
              .forEach((element) => <tr><td>{element.medication}</td></tr>) */}
            </tbody>
          </table>
        </section>
      </div>
      <div>
        <form
          onSubmit={(event) => {event.preventDefault(); return formik.handleSubmit();}}
          className='d-flex flex-column gap-10'>
          <section>
            <h1>medical records</h1>

            <div className='my-2 w-100 rounded-3 mx-auto' style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr'}}>
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
              <div>
                <input
                  type='checkbox'
                  id='alert'
                  defaultChecked={false}
                />
                <label style={{ fontSize: '13px' }} htmlFor='alert'>
                  &nbsp;Alert
                </label>
              </div>
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
              Delete
            </Link>
          </div>
        </form>
      </div>
      <div>
        <section>
          <p>medical records</p>
          {/* <Table headers=(<th>Date</th><th>Treatment Type</th><th>Medication</th><th>Weight</th><th>Due Date</th><th>Notes</th>) /> */}
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Treatment Type</th>
                <th>Medication</th>
                <th>Weight</th>
                <th>Due Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
            {records?.map(record => (
              <tr>
                <td>{record.date}</td>
                <td>{record.treatment}</td>
                <td>{record.medication}</td>
                <td>{record.weight}</td>
                <td>{record.dueDate}</td>
                <td>{record.note}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </section>
        <div className='d-flex flex-wrap post-button gap-3'>
          <button type='submit' className='button border-0' onClick={() => window.alert('Clicked Save!')}>
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
