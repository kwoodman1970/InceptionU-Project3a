import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import CustomInput from '../components/CustomInput';
import ToggleSwitch from '../components/ToggleSwitch';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpecies } from '../features/species/speicesSlice';
import { createPet, reset, resetState } from '../features/pet/petSlice';
import axios from 'axios';
import { BiArrowBack } from 'react-icons/bi';
import { MdOutlineArrowForward } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import '../css/PetPublish.css';

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
const PetPublish = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [isAllergyFriendly, setIsAllergeyFriendly] = useState(true);
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

    if (imageElement != null) {
      console.log('Setting Main Picture source to ', newSource);
      imageElement.setAttribute('src', newSource);
    }
    else {
      console.log('Could not find image element.');
    }
}

  const onDrop = async (acceptedFiles) => {
    const newSelectedFiles = [...selectedFiles, ...acceptedFiles];
    const newPreviewImages = [
      ...previewImages,
      ...Array.from(acceptedFiles).map((file) => URL.createObjectURL(file)),];
    setSelectedFiles(newSelectedFiles);
    setPreviewImages(newPreviewImages);
    console.log('Files dropped -- about to update Main Picture')
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
    updateMainPicture(newPreviewImages.length > 0 ? newPreviewImages[0] : '');
  };

  const formik = useFormik({
    initialValues: {
      cardType: 'Supplier',
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
      allergyFriendly: false,
      socializedWith: [],
      specialNeeds: '',
      images: [],
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      let imagesNames = [];
      let promises = [];

      console.log("Submitting form...");

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
                console.log(`Uploaded ${imagesNames[index]}`)
              }),
          );
        });

        await Promise.all(promises);
        values.active = document.getElementById('active').checked;
        values.searchable = document.getElementById('searchable').checked;
        values.pictures = imagesNames;
        values.allergyFriendly = document.getElementById('allergyFriendly').checked;
        dispatch(createPet(values));
        formik.resetForm();
        dispatch(resetState());
        setTimeout(() => {
          navigate('/supplier/all-pets');
        }, 1000);
        // alert(JSON.stringify(values, null, 2));
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div>
      <h4 className=' mt-0'>Post Your Pet</h4>
      <p className=' mb-0'>Please fill all information to process!</p>

      <form
        onSubmit={(event) => {event.preventDefault(); return formik.handleSubmit();}}
        className='d-flex flex-column gap-10'>
        <div className='my-2 w-100 rounded-3 mx-auto evenColumns3'>
          <input
            type='hidden'
            name='cardType'
            id='carde-type'
            value='Supplier'
          />
          <input
            type='hidden'
            name='owner'
            id='owner'
            value={supplierState._id}
          />

          <div className='span4rows'>
            <img
              className='pet-img rounded-2'
              id='MainPicture'
              src={imagePlaceholder}
              alt=''
              height='320'
            />
          </div>
          <div className='span2columns' style={{display: 'flex'}}>
            <div style={{flex: 1}}>
              <div>Owner:<br />{supplierState._id}</div>
            </div>
            <div>
              <label style={{ fontSize: '13px' }} for='active'>
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

          <div class='span2columns' style={{display: 'flex'}}>
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
              {/* <input
                type='checkbox'
                name='searchable'
                id='searchable'
                {...formik.getFieldProps('searchable')}
              />
              <label style={{ fontSize: '13px' }} for='searchable'>
                &nbsp;Searchable?
              </label> */}
              <label style={{ fontSize: '13px' }} for='searchable'>
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

              {speciesState.map((i, j) => {
                return (
                  <option key={j} value={i.species}>
                    {i.species}
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

              {speciesState.map((i, j) => {
                return (
                  <option key={j} value={i.breed}>
                    {i.breed}
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
              d_class='span2columns'
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

        <div className='my-2 w-100 rounded-3 mx-auto evenColumns3'>
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

        <div id='AddPictures' className='my-2 w-100 rounded-3 mx-auto'>
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

        <div className='my-2 w-100 rounded-3 mx-auto evenColumns3'>
          <textarea
            style={{ fontSize: '14px' }}
            className='mt-0 form-control text-dark'
            class='span3columns'
            placeholder='Enter Description'
            {...formik.getFieldProps('about')}
            value={formik.values.about}>
          </textarea>
          <div className='error ' class='span3columns'>
            {formik.touched.about && formik.errors.about ? (
              <div>{formik.errors.about}</div>
            ) : null}
          </div>

          <div>
            <select
              style={{ fontSize: '14px', height: '58px' }}
              className='  mt-3 form-select text-dark'
              name='sex'
              {...formik.getFieldProps('sex')}>
              <option value=''>Select Sex *</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Unknown'>Unknown</option>
            </select>
            <div className='error '>
              {formik.touched.sex && formik.errors.sex ? (
                <div>{formik.errors.sex}</div>
              ) : null}
            </div>
          </div>
          <div>
            <CustomInput
              type='reproductiveStatus'
              label='Reproductive Status'
              id='reproductive-status'
              name='color'
              {...formik.getFieldProps('reproductiveStatus')}
            />
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
              <option value='Small'>Small</option>
              <option value='Medium'>Medium</option>
              <option value='Large'>Large</option>
              <option value='Extra Large'>Extra Large</option>
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
              name='energy-level'
              {...formik.getFieldProps('energyLevel')}>
              <option value=''>Select Energy Level</option>
              <option value='Low'>Low</option>
              <option value='Medium'>Medium</option>
              <option value='High'>High</option>
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
              name='hair-length'
              {...formik.getFieldProps('hairLength')}>
              <option value=''>Select Hair Length</option>
              <option value='Short'>Short</option>
              <option value='Medium'>Medium</option>
              <option value='Long'>Long</option>
            </select>
            <div className='error '>
              {formik.touched.hairLength && formik.errors.hairLength ? (
                <div>{formik.errors.hairLength}</div>
              ) : null}
            </div>
          </div>
          <div>
            <CustomInput
              type='text'
              name='eye-color'
              label='Eye Color'
              id='eyeColor'
              {...formik.getFieldProps('eyeColor')}
            />
            <div className='error '>
              {formik.touched.eyeColor && formik.errors.eyeColor ? (
                <div>{formik.errors.eyeColor}</div>
              ) : null}
            </div>
          </div>

          <div>
            <CustomInput
              type='text'
              name='hairColor'
              label='Hair Color'
              id='hair-color'
              {...formik.getFieldProps('hairColor')}
            />
            <div className='error '>
              {formik.touched.hairColor && formik.errors.hairColor ? (
                <div>{formik.errors.hairColor}</div>
              ) : null}
            </div>
          </div>
          <div>
            <CustomInput
              type='text'
              name='special-needs'
              label='Special Needs'
              id='eyeColor'
              {...formik.getFieldProps('specialNeeds')}
            />
            <div className='error '>
              {formik.touched.specialNeeds && formik.errors.specialNeeds ? (
                <div>{formik.errors.specialNeeds}</div>
              ) : null}
            </div>
          </div>
          <div>
            <select
              style={{ fontSize: '14px', height: '58px' }}
              className='  mt-3 form-select text-dark'
              name='socialized-with'
              multiple
              {...formik.getFieldProps('socializedWith')}>
              <option value=''>Select Socialized With</option>
              <option value='Kids'>Kids</option>
              <option value='Cats'>Cats</option>
              <option value='Dogs'>Dogs</option>
              <option value='Other Pets'>Other Pets</option>
            </select>
            <div className='error '>
              {formik.touched.socializedWith && formik.errors.socializedWith ? (
                <div>{formik.errors.socializedWith}</div>
              ) : null}
            </div>
          </div>

          <div>
            {/* <input
              type='checkbox'
              name='allergy-friendly'
              id='allergy-friendly'
              {...formik.getFieldProps('allergyFriendly')}
            />
            <label style={{ fontSize: '13px' }} for='allergyFriendly'>
            &nbsp;Allergy Friendly?
            </label> */}
            <label style={{ fontSize: '13px' }} for='allergyFriendly'>
              Allergy Friendly
            </label><br />
            <ToggleSwitch id='allergyFriendly' isActive={isActive} onToggleChange={setIsActive} />
            <div className='error '>
              {formik.touched.allergyFriendly && formik.errors.allergyFriendly ? (
                <div>{formik.errors.allergyFriendly}</div>
              ) : null}
            </div>
          </div>
        </div>
        <div className='d-flex flex-wrap post-button gap-3'>
          <button type='submit' className='button border-0'>
            Post Pet
          </button>
          <Link className='button  border-0 ' to='/supplier'>
            Go Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PetPublish;
