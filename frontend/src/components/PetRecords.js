import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BiArrowBack } from 'react-icons/bi';
import { MdOutlineArrowForward } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import CustomInput from '../components/CustomInput';
import ToggleSwitch from '../components/ToggleSwitch';
import { getSpecies } from '../features/species/speicesSlice';
import { createPet, reset, resetState } from '../features/pet/petSlice';

let schema = Yup.object().shape({
  name: Yup.string().required('* Name is required'),
  postalCodeLocation: Yup.string().required('* Postal Code Location is required'),
  species: Yup.string().required('* Species is required'),
  breed: Yup.string().required('* Breed is required'),
  dateOfBirth: Yup.string().required('* Date of Birth is required'),
  searchable: Yup.boolean().required('* Searchable is required'),
  sex: Yup.string().required('* Sex is required'),
  size: Yup.string().required('* Pet size is required'),
});

const PetRecord = (props) => {
  const setCurrentTab = props.setCurrentTab;
  const petObjectId = props.petObjectId;

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getSpecies());
  //   dispatch(reset());
  // }, []);

  const API_URL = '/api/img/';
  const supplierState = useSelector((state) => state.supplier.supplier);
  const speciesState = useSelector((state) => state.species.species);
  const newPet = useSelector((state) => state.pet);
  const { isError, isSuccess, isLoading, createdPet, message } = newPet;

  const [isActive, setIsActive] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (isSuccess && createdPet) {
      toast.success('Successfull added new pet');
      dispatch(resetState());
    }

    if (isError) {
      toast.error(message);
      dispatch(resetState());
    }
  }, [isSuccess, isError, isLoading, createdPet, dispatch, message]);

  const formik = useFormik({
    initialValues: {
      cardType: cardType,
      name: '',
      postalCodeLocation: '',
      species: '',
      breed: '',
      price: '',
      dateOfBirth: '',
      adoptionDate: '',
      dateOfDeath: '',
      active: false,
      searchable: false,
      owner: supplierState._id,
      about: '',
      sex: '',
      reproductiveStatus: '',
      alteredDate: '',
      tattooID: '',
      microchipID: '',
      size: '',
      energyLevel: '',
      hairLength: '',
      hairColor: '',
      eyeColor: '',
      allergyFriendly: '',
      socializedWith: [],
      specialNeeds: [],
      images: [],
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        values.cardType = cardType;
        values.owner = supplierState._id;
        values.active = document.getElementById('active')?.checked;
        values.searchable = document.getElementById('searchable')?.checked;
        values.pictures = imagesNames;

        values.specialNeeds = buildStringsArrayFromCheckboxes(
          ['special-needs-physical-disability', 'special-needs-chronic-medical-condition',
           'special-needs-behavioural-issue']);

        values.socializedWith = buildStringsArrayFromCheckboxes(
          ['socialized-with-kids', 'socialized-with-cats', 'socialized-with-dogs',
            'socialized-with-other-pets']);

        values.contacts = [];
        values.records = [];

        const createdPet = dispatch(createPet(values));
        createdPet.then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            setCurrentTab((currentTab) => currentTab + 1);
            petObjectId(response.payload._id);
          }
        });
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
    <div>
      <form
        onSubmit={(event) => {event.preventDefault(); return formik.handleSubmit();}}
        className='d-flex flex-column gap-10'>
        <section>
          <h5>records</h5>

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
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                  <div>{formik.errors.dateOfBirth}</div>
                ) : null}
              </div>
            </div>
            <div>
              <select
                style={{ fontSize: '14px', height: '58px' }}
                className='  mt-3 form-select text-dark'
                name='treatment'
                {...formik.getFieldProps('sex')}>
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
                label='Date *'
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
            Save
          </button>
          <Link className='button  border-0 ' to='/supplier'>
            Delete
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PetRecord;
