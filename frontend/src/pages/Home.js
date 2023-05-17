import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Petcard from '../components/Petcard';
import WelcomeWithRegister from '../components/WelcomeWithRegister';
import Advertisement from '../components/Advertisement';
import About from '../components/About';
import axios from 'axios';
import { Pagination } from 'antd';
import UpperFooter from '../components/UpperFooter';
import { useSelector } from 'react-redux';

const Home = () => {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [sortBy, setSortBy] = useState('created-descending');
  const [sortedPets, setSortedPets] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { supplier } = useSelector((state) => state.supplier);
  const userState = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getPets = async () => {
      const { data } = await axios.get('/api/pets');
      setPets(data);
    };
    getPets();
  }, []);

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

  return (
    <>
      {user || supplier ? null :
        <div>
          <WelcomeWithRegister />
        </div>
      }
      <div className='home-top-penel'>
        <div className='container-md'>
          <div className='row g-2'>
            <div className='col-12 '>
              <div className='top-upper-links d-flex align-items-center justify-content-between'>
                <div className='top-icon py-1'>
                  <div className='hover-icon '>
                    <Link
                      to='/find-pet'
                      className='d-flex flex-wrap align-items center gap-3   '>
                      <img
                        src='icons/dog.svg'
                        className='icon'
                        alt='icon'
                        width={60}></img>
                      <div className='d-flex align-items py-2 center flex-column  '>
                        <p className=' title-penel mb-0'>find a pet</p>
                        <p className='description-penel mb-0 '>
                          Find Would Go Here
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className='top-icon'>
                  <div className='icon-hover'>
                    <Link
                      to='/find-supplier'
                      className='d-flex flex-wrap align-items center gap-3  text-white'>
                      <img
                        src='icons/supplier.svg'
                        className='icon'
                        alt='icon'
                        width={60}></img>
                      <div className='d-flex align-items py-2 center flex-column  '>
                        <p className=' title-penel mb-0'>find a supplier</p>
                        <p className='description-penel mb-0 '>
                          Find Would Go Here
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className='top-icon'>
                  <div className='icon-hover'>
                    <Link
                      to='/report-fraudelent'
                      className='d-flex flex-wrap align-items center gap-3  text-white'>
                      <img
                        src='icons/pc.svg'
                        className='icon'
                        alt='icon'
                        width={60}></img>
                      <div className='d-flex align-items py-2 center flex-column  '>
                        <p className=' title-penel mb-0'>report fraudelent</p>
                        <p className='description-penel mb-0 '>
                          Find Would Go Here
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className='top-icon'>
                  <div className='icon-hover'>
                    <Link
                      to='/research'
                      className='d-flex flex-wrap align-items center gap-3  text-white'>
                      <img
                        src='icons/scan.svg'
                        className='icon'
                        alt='icon'
                        width={60}></img>
                      <div className='d-flex align-items py-2 center flex-column  '>
                        <p className=' title-penel mb-0'>do research</p>
                        <p className='description-penel mb-0 '>
                          Find Would Go Here
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div>
                  <span className='d-flex flex-wrap align-items-center gap-3  '>
                    <img
                      src='icons/catchat.svg'
                      className='catchat'
                      alt='icon'
                      width={100}></img>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='home-middel-penel'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-5 pt-3'>
              <div className='d-flex flex-column'>
                <About />
                <p className='mid-penel-title mt-3 mb-0'>About us</p>
                <h1 className='mid-penel-big-title fw-bold '>
                  best <span className='span-stress'>source</span> for your new
                  pet.
                </h1>
                <p className='middle-penel-detail'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae
                  eligendi, ipsam aliquid sit cumque labore maxime nihil
                  possimus mollitia distinctio illum cum laborum consequuntur
                  nesciunt repudiandae vel cupiditate aperiam tenetur.
                </p>
              </div>
              <Link to='/signup'>
                <button className='button'>Register Now</button>
              </Link>
            </div>
            <div className='col-7'>
              <div className='d-flex flex-column home-pet-list'>
                <p className='mid-penel-title mt-3 mb-0'>
                  Our most recent added
                </p>
                <h1 className='mid-penel-big-title fw-bold '>
                  pet <span className='span-stress'>species</span>
                </h1>
                <p className='middle-penel-detail'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae
                  eligendi, ipsam aliquid sit cumque labore maxime nihil.
                </p>
                <div className='d-flex justify-content-end'>
                  <div className='d-flex align-items-center gap-10'>
                    <p className='mb-0 d-block' style={{ width: '80px' }}>
                      Sort By:
                    </p>
                    <select
                      id=''
                      className='form-control '
                      value={sortBy}
                      onChange={handleSortChange}>
                      <option value='title-ascending'>
                        Alphabetically, A-Z
                      </option>
                      <option value='title-descending'>
                        Alphabetically, Z-A
                      </option>
                      <option value='created-ascending'>
                        Date, old to new
                      </option>
                      <option value='created-descending'>
                        Date, new to old
                      </option>
                    </select>
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
                              <Petcard
                                petId={pet._id}
                                species={pet.species}
                                breed={pet.breed}
                                img={pet.images[0]} // Assuming the first image is used as the thumbnail
                                name={pet.name}
                                key={pet.id}
                                desc={pet.description}
                                address={
                                  pet.owner.businessInfo
                                    ? pet.owner.businessInfo.address + ', ' + pet.owner.businessInfo.city + ', ' + pet.owner.businessInfo.province
                                    : 'NaN'
                                }
                                tel={
                                  pet.owner.phone
                                    ? pet.owner.phone
                                    : 'XXX-XXX-XXXX'
                                }
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
            </div>
          </div>
        </div>
      </div>
      <UpperFooter />
      {/* Advertisement */}
      {/*<div className='container-l justify-content-center py-3 d-flex'>*/}
      {/*  <div className='row mx-auto mb-20'>*/}
      {/*    <div className='col-6 mx-auto'>*/}
      {/*      <Advertisement />*/}
      {/*    </div>*/}
      {/*    <div className='col-6 mx-auto'>*/}
      {/*      <Advertisement />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
};

export default Home;
