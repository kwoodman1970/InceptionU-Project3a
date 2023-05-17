import axios from 'axios';

const API_URL_PET = '/api/pets';

// create new pet
const createPet = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL_PET}/create-pet`, data, config);

  return response.data;
};

const getAllPets = async (token) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const response = await axios.get(`${API_URL_PET}`);
  return response.data;
};

// get pets by each supplier using supplier ID
const getAllPetsByOwner = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL_PET}/get-pets`, config);
  return response.data;
};
// update pet information
const updatePet = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL_PET + `/${data.id}`,
    {
      species: data.inputData.species,
      description: data.inputData.description,
    },
    config,
  );

  return response.data;
};
// delete pet

const deletePet = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL_PET + `/${id} `, config);

  return response.data;
};
// update pet status information
const updatePetStatus = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL_PET + `/${data.id}`,
    {
      status: data.petData,
    },
    config,
  );
  return response.data;
};

// get one pet
const getPet = async (id) => {
  const response = await axios.get(`${API_URL_PET}/${id}`);
  return response.data;
};

// delete pet

const summariesPets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL_PET + `/summary-pets `, config);

  return response.data;
};

// export authService
const petService = {
  createPet,
  updatePet,
  getAllPets,
  getPet,
  getAllPetsByOwner,
  deletePet,
  updatePetStatus,
  summariesPets,
};
export default petService;
