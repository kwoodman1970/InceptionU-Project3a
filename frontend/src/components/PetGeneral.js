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

const imagePlaceholder = '/images/pictureframe.svg';

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

const PetGeneral = (props) => {
  const setCurrentTab = props.setCurrentTab;
  const cardType = props.cardType;
  const setPetObjectId = props.setPetObjectId;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSpecies());
    dispatch(reset());
  }, []);

  const API_URL = '/api/img/';
  const supplierState = useSelector((state) => state.supplier.supplier);
  const speciesState = useSelector((state) => state.species.species);
  const newPet = useSelector((state) => state.pet);
  const { isError, isSuccess, isLoading, createdPet, message } = newPet;

  const [isActive, setIsActive] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [breeds, setBreeds]= useState(['Select Breed *']);
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

  function updateMainPicture(newSource) {
    const imageElement = document.getElementById('MainPicture');

    imageElement?.setAttribute('src', newSource);
  }

  function updateForm(changedElement) {
    if (changedElement.target.name === 'species') {
      const species   = changedElement.target.value;
      const newBreeds = speciesState.find((element) => element.name === species)?.breeds;

      setBreeds(newBreeds ? newBreeds : []);
    }
  }

  function buildStringsArrayFromCheckboxes(elementIds) {
    const result = [];

    elementIds.forEach(elementId => {
      const element = document.getElementById(elementId);

      if (element && element.checked) result.push(element.value);
    });

    return result;
  }

  const onDrop = async (acceptedFiles) => {
    const newSelectedFiles = [...selectedFiles, ...acceptedFiles];
    const newPreviewImages = [
      ...previewImages,
      ...Array.from(acceptedFiles).map((file) => URL.createObjectURL(file)),];
    setSelectedFiles(newSelectedFiles);
    setPreviewImages(newPreviewImages);
    updateMainPicture(newPreviewImages.length > 0 ? newPreviewImages[0] : '');
  };

  const handleRemoveImage = (index) => {
    const newSelectedFiles = [...selectedFiles];
    const newPreviewImages = [...previewImages];
    newSelectedFiles.splice(index, 1);
    newPreviewImages.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    setPreviewImages(newPreviewImages);
    updateMainPicture(newPreviewImages.length > 0 ? newPreviewImages[0] : imagePlaceholder);
  };

  const handleImageOrderChange = (oldIndex, newIndex) => {
    const newSelectedFiles = [...selectedFiles];
    const newPreviewImages = [...previewImages];
    newSelectedFiles.splice(
      newIndex,
      0,
      newSelectedFiles.splice(oldIndex, 1)[0],
    );
    newPreviewImages.splice(
      newIndex,
      0,
      newPreviewImages.splice(oldIndex, 1)[0],
    );
    setSelectedFiles(newSelectedFiles);
    setPreviewImages(newPreviewImages);
    updateMainPicture(newPreviewImages.length > 0 ? newPreviewImages[0] : imagePlaceholder);
  };

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
      let imagesNames = [];
      let promises = [];

      try {
        selectedFiles.forEach((file, index) => {
          const formData = new FormData();
          formData.append('image', file);
          promises.push(
            axios
              .post(API_URL, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then((res) => {
                imagesNames[index] = res.data.name;
              }),
          );
        });

        await Promise.all(promises);
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
          if (!response.error) {
            setCurrentTab((currentTab) => currentTab + 1);
            setPetObjectId(response.payload._id);
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
    },
  });

  return (
    <>
      <h2>general information</h2>

      <form
        onChange={updateForm}
        onSubmit={(event) => {event.preventDefault(); return formik.handleSubmit();}}
        className='d-flex flex-column gap-10'>
        <section>
          <div className='my-2 w-100 rounded-3 mx-auto' style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
            <div style={{gridRowEnd: 'span 4'}}>
              <img
                className='pet-img rounded-2'
                style={{border: 'blue'}}
                id='MainPicture'
                src={imagePlaceholder}
                alt=''
                height='320'
              />
              </div>
              <div style={{display: 'flex', gridColumnEnd: 'span 2'}}>
                <div style={{flex: 1}}>
                  <div>Owner:<br />{supplierState.name}</div>
                </div>
                <div>
                  <label style={{ fontSize: '13px' }} htmlFor='active'>
                    Active
                  </label><br />
                  <ToggleSwitch id='active' isActive={isActive} onToggleChange={setIsActive} />
                  <div className='error '>
                    {formik.touched.active && formik.errors.active ? (
                      <div>{formik.errors.active}</div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', gridColumnEnd: 'span 2'}}>
                <div style={{flex: 1}}>
                  <CustomInput
                    type='text'
                    name='name'
                    label='Pet Name *'
                    i_id='pet-name'
                    {...formik.getFieldProps('name')}
                  />
                  <div className='error '>
                    {formik.touched.name && formik.errors.name ? (
                      <div>{formik.errors.name}</div>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px' }} htmlFor='searchable'>
                    Searchable
                  </label><br />
                  <ToggleSwitch id='searchable' isActive={isSearchable} onToggleChange={setIsSearchable} />
                  <div className='error '>
                    {formik.touched.searchable && formik.errors.searchable ? (
                      <div>{formik.errors.searchable}</div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='species'
                  {...formik.getFieldProps('species')}>
                  <option value=''>Select Species *</option>

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
                  <option value=''>Select Breed *</option>

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
                <CustomInput
                  type='text'
                  name='postalCodeLocation'
                  label='Postal Code *'
                  i_id='postal-code'
                  {...formik.getFieldProps('postalCodeLocation')}
                />
                <div className='error '>
                  {formik.touched.postalCodeLocation && formik.errors.postalCodeLocation ? (
                    <div>{formik.errors.postalCodeLocation}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <CustomInput
                  type='number'
                  name='price'
                  label='Price'
                  i_id='price'
                  {...formik.getFieldProps('price')}
                />
                <div className='error '>
                  {formik.touched.price && formik.errors.price ? (
                    <div>{formik.errors.price}</div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className='my-2 w-100 rounded-3 mx-auto' style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
              <div>
                <CustomInput
                  type='date'
                  name='dateOfBirth'
                  label='Date Of Birth *'
                  id='date-of-birth'
                  {...formik.getFieldProps('dateOfBirth')}
                />
                <div className='error '>
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                    <div>{formik.errors.dateOfBirth}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <CustomInput
                  type='date'
                  name='adoptionDate'
                  label='Adoption Date'
                  id='adoption-date'
                  {...formik.getFieldProps('adoptionDate')}
                />
                <div className='error '>
                  {formik.touched.adoptionDate && formik.errors.adoptionDate ? (
                    <div>{formik.errors.adoptionDate}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <CustomInput
                  type='date'
                  name='dateOfDeath'
                  label='Date Of Death'
                  id='date-of-death'
                  {...formik.getFieldProps('dateOfDeath')}
                />
                <div className='error '>
                  {formik.touched.dateOfDeath && formik.errors.dateOfDeath ? (
                    <div>{formik.errors.dateOfDeath}</div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className='my-2 w-100 rounded-3 mx-auto' style={{display: 'grid', gridTemplateColumns: '200px auto'}}>
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div className='dropzone' {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>
                        Drag and drop some files here, or click to select files to
                        upload your pet images
                      </p>
                    </div>
                  </section>
                )}
              </Dropzone>
              <div className='d-flex flex-wrap py-3 gap-3 bg-light' style={{display: 'inline'}}>
                {previewImages.map((image, index) => (
                  <div className='position-relative  p-3 rounded-3' key={index}>
                    <img
                      className='pet-img rounded-2'
                      height='200px'
                      src={image}
                      key={index}
                      alt={`Preview ${index}`}
                    />
                    <div className='pet-img-close position-absolute'>
                      <button
                        className='pet-img-close-button border-0'
                        type='button'
                        onClick={() => handleRemoveImage(index)}>
                        <AiOutlineClose className='fs-6' />
                      </button>
                    </div>
                    <div className='pet-img-back position-absolute'>
                      {index !== 0 && (
                        <button
                          className='pet-img-back-button border-0'
                          type='button'
                          onClick={() => handleImageOrderChange(index, index - 1)}>
                          <BiArrowBack className='fs-6' />
                        </button>
                      )}
                    </div>
                    <div className='pet-img-forward position-absolute'>
                      {index !== previewImages.length - 1 && (
                        <button
                          className='pet-img-forward-button border-0'
                          type='button'
                          onClick={() => handleImageOrderChange(index, index + 1)}>
                          <MdOutlineArrowForward className='fs-6' />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='my-2 w-100 rounded-3 mx-auto' style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
              <textarea
                style={{ fontSize: '14px', gridColumnEnd: 'span 3' }}
                className='mt-0 form-control text-dark'
                placeholder='Enter Description'
                {...formik.getFieldProps('about')}
                value={formik.values.about}>
              </textarea>
              <div className='error' style={{gridColumnEnd: 'span 3'}}>
                {formik.touched.about && formik.errors.about ? (
                  <div>{formik.errors.about}</div>
                ) : null}
              </div>
            </div>
          </section>

          <section>
            <h5>pet attributes</h5>

            <div className='my-2 w-100 rounded-3 mx-auto' style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='sex'
                  {...formik.getFieldProps('sex')}>
                  <option value=''>Select Sex *</option>
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
              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='reproductiveStatus'
                  {...formik.getFieldProps('reproductiveStatus')}>
                  <option value=''>Select Reproductive Status</option>
                  <option value='No Preference'>No Preference</option>
                  <option value='Unknown'>Unknown</option>
                  <option value='Fixed/Altered'>Fixed/Altered</option>
                  <option value='Breeding'>Breeding</option>
                </select>
                <div className='error '>
                  {formik.touched.reproductiveStatus && formik.errors.reproductiveStatus ? (
                    <div>{formik.errors.reproductiveStatus}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <CustomInput
                  type='date'
                  name='alteredDate'
                  label='Altered Date'
                  id='altered-date'
                  {...formik.getFieldProps('alteredDate')}
                />
                <div className='error '>
                  {formik.touched.alteredDate && formik.errors.alteredDate ? (
                    <div>{formik.errors.alteredDate}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <CustomInput
                  type='text'
                  name='tattooID'
                  label='Tattoo ID'
                  id='tattoo-id'
                  {...formik.getFieldProps('tattooID')}
                />
                <div className='error '>
                  {formik.touched.tattooID && formik.errors.tattooID ? (
                    <div>{formik.errors.tattooID}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <CustomInput
                  type='text'
                  name='microchipID'
                  label='Microchip ID'
                  id='microchip-id'
                  {...formik.getFieldProps('microchipID')}
                />
                <div className='error '>
                  {formik.touched.microchipID && formik.errors.microchipID ? (
                    <div>{formik.errors.microchipID}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='size'
                  {...formik.getFieldProps('size')}>
                  <option value=''>Select Size *</option>
                  <option value='No Preference'>No Preference</option>
                  <option value='Not Applicable'>Not Applicable</option>
                  <option value='Miniture'>Miniture</option>
                  <option value='X-Small'>X-Small</option>
                  <option value='Small'>Small</option>
                  <option value='Small-Medium'>Small-Medium</option>
                  <option value='Medium'>Medium</option>
                  <option value='Medium-Large'>Medium-Large</option>
                  <option value='Large'>Large</option>
                  <option value='X-Large'>X-Large</option>
                  <option value='Giant'>Giant</option>
                </select>
                <div className='error '>
                  {formik.touched.size && formik.errors.size ? (
                    <div>{formik.errors.size}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='energyLevel'
                  {...formik.getFieldProps('energyLevel')}>
                  <option value=''>Select Energy Level</option>
                  <option value='No Preference'>No Preference</option>
                  <option value='Unknown'>Unknown</option>
                  <option value='Docile'>Docile</option>
                  <option value='Low'>Low</option>
                  <option value='Medium'>Medium</option>
                  <option value='High'>High</option>
                  <option value='Aggressive'>Aggressive</option>
                </select>
                <div className='error '>
                  {formik.touched.energyLevel && formik.errors.energyLevel ? (
                    <div>{formik.errors.energyLevel}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='hairLength'
                  {...formik.getFieldProps('hairLength')}>
                  <option value=''>Select Hair Length</option>
                  <option value='No Preference'>No Preference</option>
                  <option value='Not Applicable'>Not Applicable</option>
                  <option value='Hairless'>Hairless</option>
                  <option value='Short'>Short</option>
                  <option value='Short-Medium'>Short-Medium</option>
                  <option value='Medium'>Medium</option>
                  <option value='Medium-Long'>Medium-Long</option>
                  <option value='Long'>Long</option>
                </select>
                <div className='error '>
                  {formik.touched.hairLength && formik.errors.hairLength ? (
                    <div>{formik.errors.hairLength}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='eyeColor'
                  {...formik.getFieldProps('eyeColor')}>
                  <option value=''>Select Eye Color</option>
                  <option value='No Preference'>No Preference</option>
                  <option value='Not Applicable'>Not Applicable</option>
                  <option value='Brown'>Brown</option>
                  <option value='Amber'>Amber</option>
                  <option value='Orange/Copper'>Orange/Copper</option>
                  <option value='Hazel'>Hazel</option>
                  <option value='Yellow'>Yellow</option>
                  <option value='Green'>Green</option>
                  <option value='Blue'>Blue</option>
                  <option value='Heterochromia'>Heterochromia</option>
                  <option value='Dichroic'>Dichroic</option>
                  <option value='Blue-Green'>Blue-Green</option>
                  <option value='Red'>Red</option>
                </select>
                <div className='error '>
                  {formik.touched.eyeColor && formik.errors.eyeColor ? (
                    <div>{formik.errors.eyeColor}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='hairColor'
                  {...formik.getFieldProps('hairColor')}>
                  <option value=''>Select Hair Color</option>
                  <option value='No Preference'>No Preference</option>
                  <option value='Not Applicable'>Not Applicable</option>
                  <option value='Agouti'>Agouti</option>
                  <option value='Albino'>Albino</option>
                  <option value='Apricot Point'>Apricot Point</option>
                  <option value='Black'>Black</option>
                  <option value='Black Otter'>Black Otter</option>
                  <option value='Blue'>Blue</option>
                  <option value='Blue Cream'>Blue Cream</option>
                  <option value='Blue Point'>Blue Point</option>
                  <option value='Broken'>Broken</option>
                  <option value='Brown'>Brown</option>
                  <option value='Calico'>Calico</option>
                  <option value='Caramel Point'>Caramel Point</option>
                  <option value='Castor'>Castor</option>
                  <option value='Chinchilla Grey'>Chinchilla Grey</option>
                  <option value='Chocolate'>Chocolate</option>
                  <option value='Chocolate Point'>Chocolate Point</option>
                  <option value='Cinnamon'>Cinnamon</option>
                  <option value='Cinnamon Point'>Cinnamon Point</option>
                  <option value='Cream'>Cream</option>
                  <option value='Cream Point'>Cream Point</option>
                  <option value='Fawn'>Fawn</option>
                  <option value='Fawn Point'>Fawn Point</option>
                  <option value='Frosted Pearl'>Frosted Pearl</option>
                  <option value='Gold'>Gold</option>
                  <option value='Golden'>Golden</option>
                  <option value='Grey'>Grey</option>
                  <option value='Lavender'>Lavender</option>
                  <option value='Lavender Cream'>Lavender Cream</option>
                  <option value='Lilac'>Lilac</option>
                  <option value='Lilac Point'>Lilac Point</option>
                  <option value='Liver'>Liver</option>
                  <option value='Lynx Point'>Lynx Point</option>
                  <option value='Morph'>Morph</option>
                  <option value='Opal'>Opal</option>
                  <option value='Orange'>Orange</option>
                  <option value='Pearl'>Pearl</option>
                  <option value='Piebalds'>Piebalds</option>
                  <option value='Red'>Red</option>
                  <option value='Red Point'>Red Point</option>
                  <option value='Rust'>Rust</option>
                  <option value='Sable'>Sable</option>
                  <option value='Sable'>Sable</option>
                  <option value='Sandy'>Sandy</option>
                  <option value='Seal Point'>Seal Point</option>
                  <option value='Self'>Self</option>
                  <option value='Shaded'>Shaded</option>
                  <option value='Silver'>Silver</option>
                  <option value='Standard'>Standard</option>
                  <option value='Steel'>Steel</option>
                  <option value='Tabby'>Tabby</option>
                  <option value='Tabby Point'>Tabby Point</option>
                  <option value='Tan Pattern'>Tan Pattern</option>
                  <option value='Ticked'>Ticked</option>
                  <option value='Tortie Point'>Tortie Point</option>
                  <option value='Tortoise'>Tortoise</option>
                  <option value='Tortoiseshell'>Tortoiseshell</option>
                  <option value='Tri-colored'>Tri-colored</option>
                  <option value='Tuxedo'>Tuxedo</option>
                  <option value='White'>White</option>
                  <option value='Wideband'>Wideband</option>
                  <option value='Yellow'>Yellow</option>
                </select>
                <div className='error '>
                  {formik.touched.hairColor && formik.errors.hairColor ? (
                    <div>{formik.errors.hairColor}</div>
                  ) : null}
                </div>
              </div>
              <div style={{gridRowEnd: 'span 2', paddingLeft: '1rem'}}>
                <label style={{ fontSize: '13px' }}>
                  Special Needs:
                </label><br />
                <input
                  type='checkbox'
                  id='special-needs-physical-disability'
                  value='Physical Disability'
                />
                <label style={{ fontSize: '13px' }} htmlFor='special-needs-physical-disability'>
                  &nbsp;Physical Disability
                </label><br />
                <input
                  type='checkbox'
                  id='special-needs-chronic-medical-condition'
                  value='Chronic Medical Condition'
                />
                <label style={{ fontSize: '13px' }} htmlFor='special-needs-chronic-medical-condition'>
                  &nbsp;Chronic Medical Condition
                </label><br />
                <input
                  type='checkbox'
                  id='special-needs-behavioural-issue'
                  value='Behavioural Issue'
                />
                <label style={{ fontSize: '13px' }} htmlFor='special-needs-behavioural-issue'>
                  &nbsp;Behavioural Issue
                </label><br />
                <div className='error '>
                  {formik.touched.specialNeeds && formik.errors.specialNeeds ? (
                    <div>{formik.errors.specialNeeds}</div>
                  ) : null}
                </div>
              </div>
              <div style={{gridRowEnd: 'span 2', paddingLeft: '1rem'}}>
                <label style={{ fontSize: '13px' }}>
                  Socialized With:
                </label><br />
                <input
                  type='checkbox'
                  id='socialized-with-kids'
                  value='Kids'
                />
                <label style={{ fontSize: '13px' }} htmlFor='socialized-with-kids'>
                  &nbsp;Kids
                </label><br />
                <input
                  type='checkbox'
                  id='socialized-with-cats'
                  value='Cats'
                />
                <label style={{ fontSize: '13px' }} htmlFor='socialized-with-cats'>
                  &nbsp;Cats
                </label><br />
                <input
                  type='checkbox'
                  id='socialized-with-dogs'
                  value='Dogs'
                />
                <label style={{ fontSize: '13px' }} htmlFor='socialized-with-dogs'>
                  &nbsp;Dogs
                </label><br />
                <input
                  type='checkbox'
                  id='socialized-with-other-pets'
                  value='Other Pets'
                />
                <label style={{ fontSize: '13px' }} htmlFor='socialized-with-other-pets'>
                  &nbsp;Other Pets
                </label>
              </div>

              <div>
                <select
                  style={{ fontSize: '14px', height: '58px' }}
                  className='  mt-3 form-select text-dark'
                  name='allergyFriendly'
                  {...formik.getFieldProps('allergyFriendly')}>
                  <option value=''>Select Allergy Friendly</option>
                  <option value='No Preference'>No Preference</option>
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
                <div className='error '>
                  {formik.touched.allergyFriendly && formik.errors.allergyFriendly ? (
                    <div>{formik.errors.allergyFriendly}</div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className='d-flex flex-wrap post-button gap-3'>
              <button type='submit' className='button border-0'>
                Save
              </button>
              <Link className='button  border-0 ' to='/supplier'>
                Delete
              </Link>
            </div>
          </section>
      </form>
    </>
  );
};

export default PetGeneral;
