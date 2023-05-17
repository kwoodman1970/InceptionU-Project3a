import React from 'react';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import Petcard from '../components/Petcard';
import ReviewList from '../components/ReviewList';
import { Rating } from 'react-simple-star-rating';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ImageZoom from 'react-image-zooom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  getWishList,
  pushPetToWishList,
  reset,
} from '../features/auth/authSlice';
import Welcome from '../components/Welcome';
import { ReactComponent as FillIcon } from '../icons/rateFill.svg';
import { ReactComponent as EmptyIcon } from '../icons/rateEmpty.svg';
import { Skeleton } from 'antd';

const satisfactionWeightAdopted = 0.1;
const communicationWeightAdopted = 0.2;
const problemSolvingWeightAdopted = 0.2;
const healthOnArrivalWeightAdopted = 0.2;
const healthAfter6MonthsWeightAdopted = 0.15;
const healthAfter1YearWeightAdopted = 0.1;
const handoverSatisfactionWeightAdopted = 0.05;

const satisfactionWeightNotAdopted = 0.2;
const communicationWeightNotAdopted = 0.4;
const problemSolvingWeightNotAdopted = 0.4;

const SinglePet = () => {
  const { user } = useSelector((state) => state.auth);
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [wished, setWished] = useState(false);
  const [rating, setRating] = useState(null);
  const [rawReviews, setRawReviews] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const dispatch = useDispatch();
  const placeholder = '/images/placeholder.png';
  // const API_URL = 'http://localhost:5000';
  let imgPath = `/public/images/pets/`;

  useEffect(() => {
    const fetchPet = async () => {
      const res = await axios.get(`/api/pets/${petId}`);
      setPet(res.data);
    };
    const isWished = async () => {
      const wishlist = await dispatch(getWishList());
      const isWished = wishlist.payload.find((pet) => pet._id === petId);
      if (isWished) {
        setWished(true);
      }
    };
    dispatch(reset());
    fetchPet();
    isWished();
  }, [petId, dispatch]);

  useEffect(() => {
    const calulateRating = async () => {
      try {
        let totleRating = 0;
        const res = await axios.get(`/api/review/${pet.owner._id}`);
        const rates = res.data.reviews;
        setRawReviews(res.data.reviews);
        for (let i = 0; i < rates.length; i++) {
          if (rates[i].adopted) {
            totleRating +=
              rates[i].satisfaction * satisfactionWeightAdopted +
              rates[i].communication * communicationWeightAdopted +
              rates[i].problemSolving * problemSolvingWeightAdopted +
              rates[i].healthOnArrival * healthOnArrivalWeightAdopted +
              rates[i].healthAfter6Months * healthAfter6MonthsWeightAdopted +
              rates[i].healthAfter1Year * healthAfter1YearWeightAdopted +
              rates[i].handoverSatisfaction * handoverSatisfactionWeightAdopted;
          } else {
            totleRating +=
              rates[i].satisfaction * satisfactionWeightNotAdopted +
              rates[i].communication * communicationWeightNotAdopted +
              rates[i].problemSolving * problemSolvingWeightNotAdopted;
          }
        }
        setRating(totleRating / rates.length);
      } catch (error) {
        console.log(error);
      }
    };
    calulateRating();
  }, [pet]);

  useEffect(() => {
    if (!rawReviews) return;
    const filteredReviews = rawReviews.filter(
      (review) =>
        review.satisfactionComment && review.satisfactionComment !== '',
    );
    const sortedReviews = filteredReviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const formattedReviews = sortedReviews.map((review) => {
      return {
        user: review.user,
        comment: review.satisfactionComment,
        rate: review.satisfaction,
        date: review.createdAt,
      };
    });
    setReviews(formattedReviews);
    if (user) {
      const userReview = rawReviews.find((review) => review.user === user._id);
      if (userReview) {
        setUserReview(userReview);
      }
    }
  }, [rawReviews, user]);

  const handleWishList = (e) => {
    dispatch(pushPetToWishList(e));
    dispatch(reset());
    if (wished) {
      setWished(false);
    } else {
      setWished(true);
    }
  };

  if (!pet) {
    return (
      <div>
        <Skeleton active />
      </div>
    );
  }

  return (
    <>
      <div>
        <Welcome pageName={pet.name} />
      </div>
      <Meta title={pet.name} />
      <BreadCrumb title={pet.name} />
      <div className='main-pet-wrapper  py-3 '>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-6'>
              <div className='main-product-image'>
                <div>
                  <ImageZoom
                    src={pet.images[0] ? imgPath + pet.images[0] : placeholder}
                    zoom='300'
                  />
                </div>
              </div>
              <div className='other-product-image d-flex flex-wrap gap-10'>
                <div>
                  <ImageZoom
                    src={pet.images[1] ? imgPath + pet.images[1] : placeholder}
                    zoom='300'
                    className='img-fluid rounded-lg'
                  />
                </div>
                <div>
                  <ImageZoom
                    src={pet.images[2] ? imgPath + pet.images[2] : placeholder}
                    zoom='300'
                    className='img-fluid rounded-lg'
                  />
                </div>
                <div>
                  <ImageZoom
                    src={pet.images[3] ? imgPath + pet.images[3] : placeholder}
                    zoom='300'
                    className='img-fluid rounded-lg'
                  />
                </div>
                <div>
                  <ImageZoom
                    src={pet.images[4] ? imgPath + pet.images[4] : placeholder}
                    zoom='300'
                    className='img-fluid rounded-lg'
                  />
                </div>
              </div>
            </div>
            <div className='col-6'>
              <div className='main-product-details'>
                <div className='border-bottom d-flex flex-wrap align-items-center gap-5'>
                  <h3 className='pet-title-name mb-2'>{pet.name}</h3>
                </div>
                <div className='border-bottom py-3'>
                  <p className='price'>
                    Adoption Fee: $ {pet.price.toFixed(2)}
                  </p>
                </div>
                <div className='border-bottom py-3'>
                  <h3 className='title'>About {pet.name}</h3>
                  <div className='d-flex algin-items-center gap-10 my-3'>
                    <h3 className='product-header'>Speices:</h3>
                    <p className='product-data '>
                      {pet.species
                        .toLowerCase()
                        .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}
                    </p>
                  </div>
                  <div className='d-flex algin-items-center gap-10 my-3'>
                    <h3 className='product-header'>Breed:</h3>
                    <p className='product-data '>
                      {pet.breed
                        .toLowerCase()
                        .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}
                    </p>
                  </div>
                  <div className='d-flex algin-items-center gap-10 my-3'>
                    <h3 className='product-header'>Health Records:</h3>
                    <p className='product-data '>
                      {pet.health
                        ? pet.health
                          .toLowerCase()
                          .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
                        : 'N/A'}
                    </p>
                  </div>
                  <div className='d-flex algin-items-center gap-10 my-3'>
                    <h3 className='product-header'>Characteristics:</h3>
                    <p className='product-data '>
                      {pet.charecter
                        ? pet.charecter
                          .toLowerCase()
                          .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
                        : 'N/A'}
                    </p>
                  </div>
                  <div className='d-flex algin-items-center gap-10 my-3'>
                    <h3 className='product-header'>Availablity:</h3>
                    <p className='product-data '>
                      {pet.status
                        .toLowerCase()
                        .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}
                    </p>
                  </div>
                </div>
                <div className='border-bottom py-3'>
                  <h3 className='title'>About Supplier</h3>
                  <div className='d-flex algin-items-center gap-10 my-2'>
                    <h3 className='product-header'>
                      <span className='fw-bold'>Supplier Name</span>:
                    </h3>
                    <p className='product-data'>{pet.owner.name}</p>
                  </div>
                  <div className='d-flex align-items-center gap-10'>
                    <h3 className='product-header'>
                      <span className='fw-bold'>Rating Score</span>:
                    </h3>
                    <h5 className='mb-0'>
                      ({rating ? Math.floor(rating * 10) / 10 : 0})
                    </h5>
                    <Rating
                      fillIcon={<FillIcon />}
                      emptyIcon={<EmptyIcon />}
                      size={5}
                      initialValue={rating ? rating : 0}
                      readonly={true}
                      allowFraction={true}
                    />
                    <p className='t-review mb-0'>
                      ( {reviews ? reviews.length : 0} reviews)
                    </p>
                  </div>
                  <div className='d-flex flex-wrap gap-3 align-items-center text-center justify-content-center py-3'>
                    {user && userReview ? (
                      <>
                        <Link
                          to={`/editreview/${userReview._id}`}
                          className='button border-0 text-white'>
                          Edit Review
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/writereview/${pet.owner._id}`}
                        className='button border-0 text-white'>
                        Write Review
                      </Link>
                    )}
                    <Link className='button-1 border-0 gap-3 d-flex flex-wrap text-dark'
                          to={`/supplier/${pet.owner._id}`}>
                      View Supplier
                    </Link>
                  </div>
                </div>
                <div className='border-bottom  py-4'>
                  <h3 className='title'>Description</h3>
                  <div className='bg-white '>
                    <p className='product-header'>{pet.description}</p>
                  </div>
                </div>

                <div className='adoption-form border-bottom  py-3'>
                  <h3 className='adoption-form-title  text-center'>
                    Considering{' '}
                    <span className='fw-bold fs-2 text-danger'>{pet.name}</span>{' '}
                    for adoption?{' '}
                  </h3>
                  <div className='d-flex flex-wrap gap-3 align-items-center text-center justify-content-center py-3'>
                    {user ? (
                      <Link
                        to={`/adoption/${petId}`}
                        className='button border-0 text-white '>
                        Start Your Inquiry
                      </Link>
                    ) : (
                      <Link to='/login' className='button border-0 text-white'>
                        Start Your Inquiry
                      </Link>
                    )}
                    {user ? (
                      wished ? (
                        <button
                          onClick={() => handleWishList(petId)}
                          className='button-1 border-0 gap-3 d-flex flex-wrap'>
                          Favourite
                          <div className='wishlist-icon'>
                            <img
                              className='text-warning wishlist'
                              style={{ width: '22px' }}
                              src='/images/wished.svg'
                              alt='wishlist'
                            />
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleWishList(petId)}
                          className='button-1 border-0 gap-3 d-flex flex-wrap'>
                          Favourite
                          <div className='wishlist-icon'>
                            <img
                              className='text-warning wishlist'
                              style={{ width: '22px' }}
                              src='/images/wish.svg'
                              alt='wishlist'
                            />
                          </div>
                        </button>
                      )
                    ) : (
                      <Link
                        to='/login'
                        className='button-1 border-0 gap-3 d-flex flex-wrap'>
                        Favourite
                        <div className='wishlist-icon'>
                          <img
                            className='text-warning wishlist'
                            style={{ width: '22px' }}
                            src='/images/wish.svg'
                            alt='wishlist'
                          />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='review-wrapper home-wrapper-2 py-3'>
          <div className='container-xxl'>
            <div className='row'>
              <div className='col-12'>
                <h5 className='fw-bold'>
                  Reviews{' '}
                  {pet.owner.name
                    .toLowerCase()
                    .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}
                </h5>
                <div className='review-inner-wrapper py-2'>
                  <div className='review-head d-flex justify-content-between align-items-end'></div>
                  {reviews ? <ReviewList reviews={reviews} /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='popular-wrapper home-wrapper-2 py-5'>
          <div className='container-xxl'>
            <div className='row'>
              <div className='col-12'>
                <h5 className='section-heading fw-bold'>Suggestion Pets</h5>
              </div>
              {/* <Petcard /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePet;
