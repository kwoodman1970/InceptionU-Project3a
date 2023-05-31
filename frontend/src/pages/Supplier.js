import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import CommentPoster from '../components/CommentPoster';
import Welcome from '../components/Welcome';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { Rating } from 'react-simple-star-rating';
import { ReactComponent as FillIcon } from '../icons/rateFill.svg';
import { ReactComponent as EmptyIcon } from '../icons/rateEmpty.svg';
import { useSelector, useDispatch } from 'react-redux';
import ReviewList from '../components/ReviewList';
import { Pagination, Skeleton } from 'antd';
import PetcardProfile from '../components/PetcardProfile';

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

function Supplier() {
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const placeholder = '/images/placeholder.png';
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [sortBy, setSortBy] = useState('created-descending');
  const [sortedPets, setSortedPets] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [userReview, setUserReview] = useState(null);
  const [rawReviews, setRawReviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/supplier/basic/${supplierId}`)
      .then((response) => {
        setSupplier(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [supplierId]);

  useEffect(() => {
    const calulateRating = async () => {
      try {
        let totleRating = 0;
        const rates = supplier.reviews;
        setRawReviews(supplier.reviews);
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
  }, [supplier]);

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
      const userReview = rawReviews.find((review) => review.user._id === user._id);
      if (userReview) {
        setUserReview(userReview);
      }
    }
  }, [rawReviews, user]);

  useEffect(() => {
    const getPets = async () => {
      const { data } = await axios.get(`/api/pets/owner/${supplierId}`);
      setPets(data);
    };
    getPets();
  }, [supplierId]);

  useEffect(() => {
    const sorted = sortPets([...pets], sortBy);
    setSortedPets(sorted);
  }, [pets, sortBy]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortPets = (pets, sortBy) => {
    if (pets.length < 2) return pets;
    switch (sortBy) {
      case 'title-descending':
        return pets.sort((a, b) => b.name.localeCompare(a.name));
      case 'title-ascending':
        return pets.sort((a, b) => a.name.localeCompare(b.name));
      case 'created-descending':
        return pets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      case 'created-ascending':
        return pets.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      default:
        return pets;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!supplier) {
    return (
      <div>
        <Skeleton active />
      </div>
    );
  }

  return (
    <>
      <div>
        <Welcome pageName={supplier.name} />
      </div>
      <Meta title={supplier.name} />
      <BreadCrumb title={supplier.name} />
      <div className='main-product-wrapper home-wrapper-2 py-3'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-6'>
              <div className='main-product-image'>
                <div>
                  <img src={`/public/images/avatar/${supplier.profile[0]}`} alt='placeholder'></img>
                </div>
              </div>
              <div className='d-flex justify-content-center my-3'>
                <Pagination
                  className={'custom-pagination'}
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  total={pets.length}
                />
              </div>
              <div className='d-flex flex-wrap aligin-items-center mx-auto justify-content-center gap-10 py-3'>
                {sortedPets
                  ? sortedPets
                    .slice(
                      (currentPage - 1) * pageSize,
                      currentPage * pageSize,
                    )
                    .map((pet) => {
                      if (pets.length > 0) {
                        return (
                          <>
                            <PetcardProfile
                              petId={pet._id}
                              species={pet.species}
                              breed={pet.breed}
                              img={pet.images[0]} // Assuming the first image is used as the thumbnail
                              name={pet.name}
                              key={pet.id}
                              desc={pet.description}
                            />
                          </>
                        );
                      } else {
                        return null;
                      }
                    })
                  : null}
              </div>
              <div className='d-flex justify-content-center my-3'>
                <Pagination
                  className={'custom-pagination'}
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  total={pets.length}
                />
              </div>
            </div>
            <div className='col-6'>
              <div>
                <h5 className='py-3' style={{ fontWeight: 'bolder' }}>
                  {supplier?.name.toUpperCase()} CONTACT
                </h5>
                <p style={{ fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold' }}>Address:</span>{' '}
                  {supplier?.businessInfo?.address + ', ' + supplier?.businessInfo?.city + ', ' + supplier?.businessInfo?.province}
                </p>
                <p style={{ fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold' }}>Phone:</span>{' '}
                  {supplier?.phone}
                </p>
                <p style={{ fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold' }}>Email:</span>{' '}
                  {supplier?.email}
                </p>
                <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                  Joined PetStarz since{' '}
                  {new Date(supplier.createdAt).toISOString().slice(0, 10)}
                </p>
                <div className='border-bottom py-3'>
                  <div className='d-flex align-items-center gap-10'>
                    <h5>Overall rating:</h5>
                    <Rating
                      fillIcon={<FillIcon />}
                      emptyIcon={<EmptyIcon />}
                      size={5}
                      initialValue={rating}
                      readonly={true}
                      allowFraction={true}
                    />
                    <p className='t-review mb-0'></p>
                  </div>
                  <div className='py-3'>
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
                        to={`/writereview/${supplierId}`}
                        className='button border-0 text-white'>
                        Write Review
                      </Link>
                    )}
                  </div>
                </div>
                <div className='border-bottom  py-4'>
                  <h5 className='mt-3' style={{ fontWeight: 'bolder' }}>
                    ABOUT {supplier?.name.toUpperCase()}
                  </h5>
                  <div className='bg-white '>
                    <p className='product-header'>
                      {' '}
                      <p>
                        {supplier.description ? supplier.description :
                          'Welcome to our page. We are passionate about matching' +
                          ' loving families with the perfect pets to bring joy and' +
                          ' companionship to your home.'}
                      </p>
                    </p>
                  </div>
                </div>
                <h5 className='mt-3' style={{ fontWeight: 'bolder' }}>
                  REVIEW ABOUT {supplier?.name.toUpperCase()}
                </h5>
                {reviews ? <ReviewList reviews={reviews} /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Supplier;
