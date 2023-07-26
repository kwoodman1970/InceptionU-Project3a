import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from '../components/CustomInput';
import { getSpecies } from '../features/species/speicesSlice';

let schema = Yup.object().shape({
  // date: Yup.string().required('* Date is required'),
  // treatment: Yup.string().required('* Treatment Type is required'),
});

const SearchPetCriteria = (props) => {
  const speciesState = useSelector((state) => state.species.species);
  const [breeds, setBreeds]= useState(['Select Breed *']);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSpecies());
  }, []);

  function updateForm(changedElement) {
    if (changedElement.target.name === 'species') {
      const species   = changedElement.target.value;
      const newBreeds = speciesState.find((element) => element.name === species)?.breeds;

      setBreeds(newBreeds ? newBreeds : []);
    }
  }

  const formik = useFormik({
    initialValues: {
      // date: '',
      // maxPrice: '',
      // alert: false,
      // medication: '',
      // weight: '',
      // dueDate: '',
      // note: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const newQuery = {}

      if (values.price != '') newQuery.price = values.price;
      if (values.species != '') newQuery.species = values.species;
      if (values.breed != '') newQuery.breed = values.breed;
      if (values.sex != '') newQuery.sex = values.sex;

      // props.setQuery({price: parseInt(values.price), species: values.species, breed: values.breed, sex: values.sex});
      props.setQuery(Object.keys(newQuery).length > 0 ? newQuery : null);
    },
  });

   return (
    <>
      <div>
        <form
          className='d-flex flex-column gap-10'
          onChange={updateForm}
          onSubmit={(event) => {event.preventDefault(); return formik.handleSubmit();}}>
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
                  <option value={''}>How much do you want to pay for your pet?</option>
                  <option value={100}>$100</option>
                  <option value={1000}>$1000</option>

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
                  <option value={''}>What pet species are you looking for?</option>

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
                  <option value={''}>Are you looking for a specific breed?</option>

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
                  <option value={''}>What sex are you looking for?</option>
                  <option value={''}>No Preference</option>
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
              Apply
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
