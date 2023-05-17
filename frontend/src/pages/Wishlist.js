import React, { useEffect } from 'react';
import Petcard from '../components/Petcard';
import { useSelector, useDispatch } from 'react-redux';
import { getWishList, reset } from '../features/auth/authSlice';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import Welcome from '../components/Welcome';
import Box from '@mui/material/Box';

const Wishlist = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reset());
    dispatch(getWishList());
  }, []);
  const wishlistState = useSelector((state) => state.auth.userWishlists);
  const pageName = 'Wishlist';
  return (
    <>
      <div>
        <Welcome pageName={pageName} />
      </div>
      <Meta title={pageName} />
      <BreadCrumb title={pageName} />
      <div className='container-sm'>
        <div className='row'>
          <div className='col-12 d-flex flex-wrap aligin-items-center justify-content-begin py-3 px-3 my-auto'>
            {wishlistState?.length > 0 ? (
              wishlistState.map((pet, i) => (
                <Petcard
                  petId={pet._id}
                  img={pet.images[0]}
                  name={pet.name}
                  desc={pet.description}
                  tel={pet.owner ? pet.owner.phone : 'N.A'}
                  address={pet.owner ? pet.owner.businessInfo.address : 'N.A'}
                />
              ))
            ) : (
              <div className='d-flex flex-column justify-content-between'>
                <p className=' text-center fw-bold '>Your wishlist is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
