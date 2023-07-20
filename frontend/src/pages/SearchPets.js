import { useParams, useLocation, Link } from 'react-router-dom';
import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dropdown, Menu, Skeleton, Slider, List, Button, Input, Select, Space,
} from 'antd';
import {
  MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent,
} from 'react-leaflet';
import { EsriProvider } from 'leaflet-geosearch';
import PetcardMini from '../components/PetcardMini';
import L from 'leaflet';
import iconUrl from '../icons/marker-icon.png';
import iconSelectUrl from '../icons/marker-icon-select.png';
import iconUserUrl from '../icons/marker-icon-user.png';
import loactionUserUrl from '../icons/userLocation.png';
import filterUrl from '../icons/filter.png';
import SearchPetCriteria from '../components/SearchPetCriteria';

const customIcon = L.icon({
  iconUrl: iconUrl, iconSize: [30, 80],
});

const highlightIcon = L.icon({
  iconUrl: iconSelectUrl, iconSize: [38, 100],
});

const userIcon = L.icon({
  iconUrl: iconUserUrl, iconSize: [30, 60],
});

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

const filterMaxPrice = 1000;
const filterMaxAge = 15;
const filterMaxDistance = 30;

function SearchPets() {
  const [state, setState] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  //Map
  const defaultCenter = [51.0, -114.1];
  const defaultZoom = 11;
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filteredPets, setFilteredPets] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState([51.0, -114.1]);
  const [userPostCode, setUserPostCode] = useState(null);

  //Antd List
  const position = 'both';
  const align = 'center';
  const defaultPageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [usedIds, setUsedIds] = useState(new Set());
  const [sortMethod, setSortMethod] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState({
    price: [0, filterMaxPrice], age: [0, filterMaxAge], distance: [0, filterMaxDistance],
  });

  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const toRad = (Value) => {
    return (Value * Math.PI) / 180;
  };
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleMouseOver = (index, currentPage) => {
    let temp = index + (currentPage - 1) * defaultPageSize;
    setActivePoint(filteredPets[temp]);
    setSelectedMarker(filteredPets[temp].owner._id);
  };

  const handleMouseLeave = (index, currentPage) => {
    setActivePoint(null);
    setSelectedMarker(null);
  };

  const MapUpdater = ({ activePoint, setActivePoint }) => {
    const map = useMap();
    if (activePoint) {
      map.flyTo([activePoint.lat, activePoint.lng], 13);
    }
    setActivePoint(null);
    return null;
  };

  async function fetchUserLocation() {
    // navigator.geolocation.getCurrentPosition can only be used in https
    try {
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then(function(result) {
            if (result.state === 'granted') {
              console.log(result.state);
              navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
              });
            } else {
              fetch('http://ip-api.com/json/?fields=61439')
                .then(res => res.json())
                .then(data => {
                  console.log(data);
                  const lat = data.lat;
                  const lon = data.lon;
                  setUserLocation([lat, lon]);
                });
            }
            result.onchange = function() {
              console.log(result.state);
            };
          });
      } else {
        alert('Sorry Not available!');
        fetch('http://ip-api.com/json/?fields=61439').then(res => {
          const lat = res.lat;
          const lon = res.lon;
          setUserLocation([lat, lon]);
        });
      }
    } catch (error) {
      console.error('Error fetching user location:', error);
      fetch('http://ip-api.com/json/?fields=61439')
        .then(res => res.json())
        .then(data => {
          console.log(data);
          const lat = data.lat;
          const lon = data.lon;
          setUserLocation([lat, lon]);
        });
      return null;
    }
  }

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    fetchUserLocation();
    if (query) {
      axios
        .get(`/api/pets/search/${query}`)
        .then((res) => {
          setResults(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    } else {
      axios
        .get(`/api/pets/`)
        .then((res) => {
          setResults(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }, [query]);

  useEffect(() => {
    const owners = new Set();
    results.forEach((result) => {
      const existingOwner = Array.from(owners).find((owner) => owner._id === result.owner._id);
      if (!existingOwner) {
        owners.add(result.owner);
      }
    });
    setOwners([...owners]);
  }, [results]);

  useEffect(() => {
    const transAddressAndRating = async (pets) => {
      const provider = new EsriProvider();
      const transResults = await Promise.all(Array.from(owners).map(async (owner) => {
        return await provider.search({
          query: owner.businessInfo.address + ', ' + owner.businessInfo.city + ', ' + owner.businessInfo.province,
        });
      }));
      const ownerLocations = transResults.map((result) => ({
        lat: result[0] ? result[0].y : 0, lng: result[0] ? result[0].x : 0,
      }));

      const updatedPets = results.map((pet) => {
        const ownerIndex = Array.from(owners).findIndex((owner) => owner._id === pet.owner._id);
        const ownerLocation = ownerLocations[ownerIndex];
        let finalRating = 0;
        let totalRating = 0;
        const rates = pet.owner.reviews;
        for (let i = 0; i < rates.length; i++) {
          if (rates[i].adopted) {
            totalRating += rates[i].satisfaction * satisfactionWeightAdopted + rates[i].communication * communicationWeightAdopted + rates[i].problemSolving * problemSolvingWeightAdopted + rates[i].healthOnArrival * healthOnArrivalWeightAdopted + rates[i].healthAfter6Months * healthAfter6MonthsWeightAdopted + rates[i].healthAfter1Year * healthAfter1YearWeightAdopted + rates[i].handoverSatisfaction * handoverSatisfactionWeightAdopted;
          } else {
            totalRating += rates[i].satisfaction * satisfactionWeightNotAdopted + rates[i].communication * communicationWeightNotAdopted + rates[i].problemSolving * problemSolvingWeightNotAdopted;
          }
        }
        finalRating = totalRating / rates.length;
        return {
          ...pet, lat: ownerLocation.lat, lng: ownerLocation.lng, rating: finalRating,
        };
      });
      return updatedPets;
    };

    setLoading(true);
    transAddressAndRating([...pets])
      .then((updatedPets) => {
        setFilteredPets(updatedPets);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [owners]);


  useEffect(() => {
    handleSort();
  }, [sortMethod]);

  const handleChangeSort = (value) => {
    setSortMethod(value);
  };

  const handleSort = () => {
    if (sortMethod === 'rate-high') {
      setFilteredPets(filteredPets.sort((a, b) => b.rating - a.rating));
    } else if (sortMethod === 'rate-low') {
      setFilteredPets(filteredPets.sort((a, b) => a.rating - b.rating));
    } else if (sortMethod === 'price-high') {
      setFilteredPets(filteredPets.sort((a, b) => (b.price || 0) - (a.price || 0)));
    } else if (sortMethod === 'price-low') {
      setFilteredPets(filteredPets.sort((a, b) => (a.price || 0) - (b.price || 0)));
    } else if (sortMethod === 'distance-near') {
      setFilteredPets(filteredPets.sort((a, b) => {
        const aDistance = calcDistance(userLocation[0], userLocation[1], a.lat, a.lng);
        const bDistance = calcDistance(userLocation[0], userLocation[1], b.lat, b.lng);
        return aDistance - bDistance;
      }));
    } else if (sortMethod === 'distance-far') {
      setFilteredPets(filteredPets.sort((a, b) => {
        const aDistance = calcDistance(userLocation[0], userLocation[1], a.lat, a.lng);
        const bDistance = calcDistance(userLocation[0], userLocation[1], b.lat, b.lng);
        return bDistance - aDistance;
      }));
    } else if (sortMethod === 'date-new') {
      setFilteredPets(filteredPets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } else if (sortMethod === 'date-old') {
      setFilteredPets(filteredPets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    }
  };

  const handleChangeLocation = () => {
    const provider = new EsriProvider();
    provider.search({ query: userPostCode }).then((results) => {
      setUserLocation([results[0].y, results[0].x]);
    });
  };

  const handleApplyFilter = () => {
    const lowPrice = filter.price[0];
    const highPrice = filter.price[1] === filterMaxPrice ? 100000000 : filter.price[1];
    const lowAge = filter.age[0];
    const highAge = filter.age[1] === filterMaxAge ? 100 : filter.age[1];
    const highDistance = filter.distance[1] === filterMaxDistance ? 100000000 : filter.distance[1];

    const filtered = filteredPets.filter((pet) => {
      if (lowPrice <= pet.price && pet.price <= highPrice && lowAge <= pet.age && pet.age <= highAge) {
        const distance = calcDistance(userLocation[0], userLocation[1], pet.lat, pet.lng);
        return distance <= highDistance;
      }
      return false;
    });
    setFilteredPets(filtered);
    setVisible(false);
  };

  const FilterMenu = (<Menu style={{ padding: '20px', width: '250px' }}>
    <div className='row'>
      <div className='col-md-12 fw-bolder'>
        <p>💰Price</p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-1'>
        <p>{filter.price[0]}</p>
      </div>
      <div className='col-md-8'>
        <Slider
          range
          defaultValue={[0, filterMaxPrice]}
          max={filterMaxPrice}
          min={0}
          step={10}
          onChange={(value) => {
            setFilter({ ...filter, price: value });
          }}
        />
      </div>
      <div className='col-md-1'>
        <p>
          {filter.price[1]}
          {filter.price[1] > 990 ? '+' : ''}
        </p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-12 fw-bolder'>
        <p>🐣Age</p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-1'>
        <p>{filter.age[0]}</p>
      </div>
      <div className='col-md-8'>
        <Slider
          range
          defaultValue={[0, filterMaxAge]}
          max={filterMaxAge}
          min={0}
          step={1}
          onChange={(value) => {
            setFilter({ ...filter, age: value });
          }}
        />
      </div>
      <div className='col-md-1'>
        <p>
          {filter.age[1]}
          {filter.age[1] > 14 ? '+' : ''}
        </p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-12 fw-bolder'>
        <p>🚗Distance(km)</p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-9'>
        <Slider
          defaultValue={filterMaxDistance}
          max={filterMaxDistance}
          min={0}
          step={1}
          onChange={(value) => {
            setFilter({ ...filter, distance: [0, value] });
          }}
        />
      </div>
      <div className='col-md-2'>
        <p>
          {filter.distance[1]}
          {filter.distance[1] > 29 ? '+' : ''}
        </p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-12'>
        <Button
          type='primary'
          className='button-2'
          onClick={handleApplyFilter}>
          Apply
        </Button>
      </div>
    </div>
  </Menu>);

  return !filteredPets ? (
    <div className='col-md-12'>
      <Skeleton active />
    </div>
  ) : (
    <div className='row col-md-12 outlet'>
      <div className='col-md-4 mx-auto'>
        <div className='row mx-auto'>
          <div className='col-md-1 mx-auto'>
            <img
              style={{ height: '30px', width: 'auto' }}
              src={loactionUserUrl}
              alt='location'
            />
          </div>
          <div className='col-md-5'>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder='Post Code'
                onChange={(e) => {
                  setUserPostCode(e.target.value);
                }}
              />
              <Button
                type='primary'
                className='button-2'
                onClick={handleChangeLocation}>
                ↵
              </Button>
            </Space.Compact>
          </div>
          <div className='col-md-5'>
            <Select
              placement='bottomRight'
              size={'middle'}
              listHeight={400}
              defaultValue=''
              style={{ width: 150 }}
              onChange={handleChangeSort}
              options={[{
                label: '❤️Rate',
                options: [{ label: '↓ From Highest', value: 'rate-high' }, {
                  label: '↑ From Lowest',
                  value: 'rate-low',
                }],
              }, {
                label: '💰Price',
                options: [{ label: '↓ From Highest', value: 'price-high' }, {
                  label: '↑ From Lowest',
                  value: 'price-low',
                }],
              }, {
                label: '🚗Distance',
                options: [{ label: '↓ From Furthest', value: 'distance-far' }, {
                  label: '↑ From Nearest',
                  value: 'distance-near',
                }],
              }, {
                label: '📅Date',
                options: [{ label: '↓ From Newest', value: 'date-new' }, {
                  label: '↑ From Oldest',
                  value: 'date-old',
                }],
              }]}
            />
          </div>
          <div className='col-md-1'>
            <Dropdown
              overlay={FilterMenu}
              trigger={'click'}
              placement={'bottomRight'}
              visible={visible}
              onVisibleChange={(flag) => setVisible(flag)}>
              <div onClick={(e) => e.preventDefault()}>
                <img
                  style={{ height: '20px', width: 'auto' }}
                  src={filterUrl}
                  alt='filter'
                />
              </div>
            </Dropdown>
          </div>
        </div>
        <div
          className='row col-md-12 mt-3 mb-3'
          id='scrollableDiv'
          style={{
            height: '78vh', overflow: 'auto', padding: '0 16px',
          }}>
          {loading || !filteredPets ? (<div className='col-md-12'>
            <Skeleton active />
          </div>) : (<List
            dataSource={filteredPets}
            split={false}
            renderItem={(pet, index) => (<List.Item>
              <PetcardMini
                petId={pet._id}
                species={pet.species}
                breed={pet.breed}
                img={pet.pictures[0]} // Assuming the first image is used as the thumbnail
                name={pet.name}
                key={pet.id}
                desc={pet.owner.name}
                price={pet.price}
                address={pet.owner ? pet.owner.businessInfo.address : 'NaN'}
                rating={pet.rating ? pet.rating : 0}
                onMouseOver={() => handleMouseOver(index, currentPage)}
                onMouseLeave={() => handleMouseLeave(index, currentPage)}
              />
            </List.Item>)}
          />)}
        </div>
        {/*Following is another style of pagination*/}
        {/*<List*/}
        {/*  pagination={{*/}
        {/*    position: position, align: align,*/}
        {/*    defaultPageSize: defaultPageSize,*/}
        {/*    current: currentPage,*/}
        {/*    onChange: handlePaginationChange,*/}
        {/*  }}*/}
        {/*  dataSource={pets}*/}
        {/*  split={false}*/}
        {/*  renderItem={(pet, index) => (*/}
        {/*    <List.Item>*/}
        {/*      <PetcardMini*/}
        {/*        petId={pet._id}*/}
        {/*        species={pet.species}*/}
        {/*        breed={pet.breed}*/}
        {/*        img={pet.images[0]} // Assuming the first image is used as the thumbnail*/}
        {/*        name={pet.name}*/}
        {/*        key={pet.id}*/}
        {/*        desc={pet.owner.name}*/}
        {/*        price={pet.price}*/}
        {/*        address={*/}
        {/*          pet.owner*/}
        {/*            ? pet.owner.businessInfo.address*/}
        {/*            : 'NaN'*/}
        {/*        }*/}
        {/*        rating={pet.rating ? pet.rating : 0}*/}
        {/*        onMouseOver={() => handleMouseOver(index, currentPage)}*/}
        {/*        onMouseLeave={() => handleMouseLeave(index, currentPage)}*/}
        {/*      />*/}
        {/*    </List.Item>*/}
        {/*  )}*/}
        {/*/>*/}
      </div>
      <SearchPetCriteria />
      <div className='col-md-8' style={{ paddingTop: '1rem' }}>
        <MapContainer
          center={userLocation ? userLocation : defaultCenter}
          zoom={defaultZoom}
          style={{ height: '95%', width: '100%', zIndex: 1 }}
          whenCreated={(map) => setState({ map })}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          {userLocation && (<Marker position={userLocation} icon={userIcon}>
            <Popup>Your are here!</Popup>
          </Marker>)}
          {filteredPets.map((pet, index) => selectedMarker && selectedMarker === pet.owner._id ? (<Marker
            key={index}
            position={[pet.lat, pet.lng]}
            icon={highlightIcon}>
            <Popup>
              <div>
                <h5>{pet.owner.name}</h5>
                <p>{pet.owner.businessInfo.address}</p>
                <Link
                  className='text-dark button-2'
                  to={`/supplier/${pet.owner._id}`}>
                  VIEW
                </Link>
              </div>
            </Popup>
          </Marker>) : (<Marker
            key={index}
            position={[pet.lat, pet.lng]}
            icon={customIcon}>
            <Popup>
              <div>
                <h5>{pet.owner.name}</h5>
                <p>{pet.owner.businessInfo.address}</p>
                <div className='row'>
                  <div className='col-md-6'>
                    <Link
                      className='text-dark button-2'
                      to={`/supplier/${pet.owner._id}`}>
                      VIEW
                    </Link>
                  </div>
                  <div className='col-md-6'>
                    <a
                      className='text-dark button-2'
                      href={`https://www.google.com/maps/search/?api=1&query=${pet.lat},${pet.lng}`}
                      target='_blank'
                      rel='noreferrer'>🗺️Go
                    </a>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>))}
          <MapUpdater
            activePoint={activePoint}
            setActivePoint={setActivePoint}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default SearchPets;
