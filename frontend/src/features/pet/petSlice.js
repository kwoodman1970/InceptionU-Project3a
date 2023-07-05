import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import petService from './petService';

const initialState = {
  pets: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// create new pet
export const createPet = createAsyncThunk(
  'pet/createPet',
  async (petData, thunkAPI) => {
    try {
      // get token from supplier
      const token = thunkAPI.getState().supplier.supplier.token;
      return await petService.createPet(petData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const getAllPets = createAsyncThunk(
  'pets/get-pets',
  async (_, thunkAPI) => {
    try {
      // get token from supplier login
      //const token = thunkAPI.getState().supplier.supplier.token;
      return await petService.getAllPets();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const getAllPetsByOwner = createAsyncThunk(
  'pets/get-owner-pet',
  async (_, thunkAPI) => {
    try {
      // get token from supplier login
      const token = thunkAPI.getState().supplier.supplier.token;
      return await petService.getAllPetsByOwner(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const getaPet = createAsyncThunk(
  'pets/get-apet',
  async (id, thunkAPI) => {
    try {
      // get token from user
      // const token = thunkAPI.getState().supplier.supplier.token;
      return await petService.getPet(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const getPet = createAsyncThunk('pets/get-pet', async (id, thunkAPI) => {
  try {
    // get token from user
    // const token = thunkAPI.getState().supplier.supplier.token;
    return await petService.getPet(id);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updatePet = createAsyncThunk(
  'pets/update-pet',
  async (data, thunkAPI) => {
    try {
      // get token from supplier login
      const token = thunkAPI.getState().supplier.supplier.token;
      return await petService.updatePet(token, data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
//Delete pet

export const deletePet = createAsyncThunk(
  'pets/delete',
  async (id, thunkAPI) => {
    try {
      // get token from supplier login
      const token = thunkAPI.getState().supplier.supplier.token;
      return await petService.deletePet(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
//add pet to wishlist

export const pushPetToWishList = createAsyncThunk(
  'pets/wishlish',
  async (_, thunkAPI) => {
    try {
      // get token from supplier login
      const token = thunkAPI.getState().auth.user.token;
      return await petService.pushPetToWishlist(_, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
//add pet to wishlist

export const summariesPets = createAsyncThunk(
  'pets/summary-pets',
  async (_, thunkAPI) => {
    try {
      // get token from supplier login
      const token = thunkAPI.getState().supplier.supplier.token;

      return await petService.summariesPets(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
// create supplierslice --> it is an object, reducers is actions
export const resetState = createAction('Reset_all');

// create supplierslice --> it is an object, reducers is actions

export const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createPet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdPet = action.payload;
      })
      .addCase(createPet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.pets = null;
      })
      .addCase(getAllPets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.pets = action.payload;
      })
      .addCase(getAllPets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllPetsByOwner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPetsByOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.pets = action.payload;
      })
      .addCase(getAllPetsByOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(summariesPets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(summariesPets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.summariesPets = action.payload;
      })
      .addCase(summariesPets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deletePet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedPet = action.payload;
      })
      .addCase(deletePet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getaPet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.petName = action.payload.name;
        state.petSpecies = action.payload.species;
        state.petBreed = action.payload.breed;
        state.petAge = action.payload.age;
        state.petColor = action.payload.color;
        state.petSize = action.payload.size;
        state.petWeight = action.payload.weight;
        state.petPrice = action.payload.price;
        state.petStatus = action.payload.status;
        state.petImages = action.payload.images;
        state.petOwner = action.payload.owner;
        state.petCreated = action.payload.createdAt;
      })
      .addCase(getaPet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(getPet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.pets = action.payload;
      })
      .addCase(getPet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(updatePet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedPet = action.payload;
      })
      .addCase(updatePet.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(pushPetToWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(pushPetToWishList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.wishlist = action.payload.wishlist;
      })
      .addCase(pushPetToWishList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});

export const { reset } = petSlice.actions;

export default petSlice.reducer;
