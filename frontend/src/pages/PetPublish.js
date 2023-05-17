import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import CustomInput from '../components/CustomInput';
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

let schema = Yup.object().shape({
  name: Yup.string().required('* Name is required'),
  species: Yup.string().required('* Species is required'),
  breed: Yup.string().required('* Breed is required'),
  age: Yup.string().required('* Age is required'),
  color: Yup.string().required('* Pet color is required'),
  eyeColor: Yup.string().required('* Pet eye color is required'),
  size: Yup.string().required('* Pet size is required'),
  weight: Yup.number().required('* Pet weight is required'),
  price: Yup.number().required('* Pet price is required'),
  images: Yup.array().required('* Pet images is required'),
  description: Yup.string().required('* Pet description is required'),
});
const PetPublish = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getSpecies());
    dispatch(reset());
  }, []);

  const API_URL = '/api/img/';
  const speciesState = useSelector((state) => state.species.species);
  const newPet = useSelector((state) => state.pet);
  const { isError, isSuccess, isLoading, createdPet, message } = newPet;

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

  const onDrop = async (acceptedFiles) => {
    const files = acceptedFiles;
    setSelectedFiles([...selectedFiles, ...files]);
    setPreviewImages([
      ...previewImages,
      ...Array.from(files).map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (index) => {
    const newSelectedFiles = [...selectedFiles];
    const newPreviewImages = [...previewImages];
    newSelectedFiles.splice(index, 1);
    newPreviewImages.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    setPreviewImages(newPreviewImages);
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
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      species: '',
      breed: '',
      age: '',
      color: '',
      eyeColor: '',
      size: '',
      weight: '',
      price: '',
      images: [],
      description: '',
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
        values.images = imagesNames;
        dispatch(createPet(values));
        formik.resetForm();
        dispatch(resetState());
        setTimeout(() => {
          navigate('/supplier/all-pets');
        }, 1000);
        alert(JSON.stringify(values, null, 2));
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
        onSubmit={formik.handleSubmit}
        className='d-flex flex-column gap-10'>
        <div className='my-2 w-100 rounded-3 mx-auto '>
          <CustomInput
            type='text'
            name='name'
            label='Pet name'
            i_id='pet-name'
            onChange={formik.handleChange('name')}
            value={formik.values.name}
            onBlur={formik.handleChange('name')}
          />
          <div className='error '>
            {formik.touched.name && formik.errors.name ? (
              <div>{formik.errors.name}</div>
            ) : null}
          </div>

          <select
            style={{ fontSize: '14px', height: '58px' }}
            className='  mt-3 form-select text-dark'
            name='species'
            onChange={formik.handleChange('species')}
            onBlur={formik.handleBlur('species')}
            value={formik.values.species}>
            <option value=''>Select Species</option>

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
          <select
            style={{ fontSize: '14px', height: '58px' }}
            className='  mt-3 form-select text-dark'
            name='breed'
            onChange={formik.handleChange('breed')}
            onBlur={formik.handleBlur('breed')}
            value={formik.values.breed}>
            <option value=''>Select Breed</option>

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

          <CustomInput
            type='text'
            name='age'
            label='Pet Age'
            id='pet-Age'
            onChange={formik.handleChange('age')}
            onBlur={formik.handleBlur('age')}
            value={formik.values.age}
          />
          <div className='error '>
            {formik.touched.age && formik.errors.age ? (
              <div>{formik.errors.age}</div>
            ) : null}
          </div>
          <CustomInput
            type='text'
            label='Pet Color'
            id='pet-color'
            name='color'
            onChange={formik.handleChange('color')}
            onBlur={formik.handleBlur('color')}
            value={formik.values.color}
          />
          <div className='error '>
            {formik.touched.color && formik.errors.color ? (
              <div>{formik.errors.color}</div>
            ) : null}
          </div>
          <CustomInput
            type='text'
            name='eyeColor'
            label='Pet Eye Color'
            id='eyeColor'
            onChange={formik.handleChange('eyeColor')}
            onBlur={formik.handleBlur('eyeColor')}
            value={formik.values.eyeColor}
          />
          <div className='error '>
            {formik.touched.eyeColor && formik.errors.eyeColor ? (
              <div>{formik.errors.eyeColor}</div>
            ) : null}
          </div>
          <select
            style={{ fontSize: '14px', height: '58px' }}
            className='  mt-3 form-select text-dark'
            name='size'
            onChange={formik.handleChange('size')}
            onBlur={formik.handleBlur('size')}
            value={formik.values.size}>
            <option value=''>Select Size</option>
            <option value='small'>S</option>
            <option value='medium'>M</option>
            <option value='large'>L</option>
            <option value='extraLarge'>XL</option>
          </select>

          <div className='error '>
            {formik.touched.size && formik.errors.size ? (
              <div>{formik.errors.size}</div>
            ) : null}
          </div>
          <CustomInput
            type='text'
            name='weight'
            label='Pet Weight'
            id='weight'
            onChange={formik.handleChange('weight')}
            onBlur={formik.handleBlur('weight')}
            value={formik.values.weight}
          />
          <div className='error '>
            {formik.touched.weight && formik.errors.weight ? (
              <div>{formik.errors.weight}</div>
            ) : null}
          </div>
          <CustomInput
            type='text'
            name='price'
            label='Pet Price'
            id='price'
            onChange={formik.handleChange('price')}
            onBlur={formik.handleBlur('price')}
            value={formik.values.price}
          />
          <div className='error '>
            {formik.touched.price && formik.errors.price ? (
              <div>{formik.errors.price}</div>
            ) : null}
          </div>
          <div className='mt-3'>
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
          </div>
          <div className='d-flex flex-wrap py-3 gap-3 bg-light'>
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
          <textarea
            style={{ fontSize: '14px' }}
            className='mt-0 form-control text-dark'
            placeholder='Enter Description'
            onChange={formik.handleChange('description')}
            value={formik.values.description}></textarea>

          <div className='error '>
            {formik.touched.description && formik.errors.description ? (
              <div>{formik.errors.description}</div>
            ) : null}
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
