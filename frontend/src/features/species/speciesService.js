import axios from 'axios';
const API_URL = '/api/species';

const getSpecies = async () => {
  // const getTokenFromLocalStorage = localStorage.getItem('user')
  //   ? JSON.parse(localStorage.getItem('user'))
  //   : '';

  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${getTokenFromLocalStorage.token}`,
  //     Accept: 'application/json',
  //   },
  // };

  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const response = await axios.get(API_URL);
  return response.data;
};

// create new speices
const createSpecies = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + '/add-species', data, config);

  return response.data;
};
// update speices information
const updateSpecies = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + `/${data.id}`,
    {
      species: data.inputData.species,
      description: data.inputData.description,
    },
    config,
  );

  return response.data;
};
// get one speices
const getOneSpecies = async (speciesId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + `/${speciesId}`, config);

  return response.data;
};

// delete species

const deleteSpecies = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + `/${id} `, config);

  return response.data;
};

const userService = {
  getSpecies,
  createSpecies,
  deleteSpecies,
  getOneSpecies,
  updateSpecies,
};

export default userService;
