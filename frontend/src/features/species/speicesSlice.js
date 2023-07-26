import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import speciesService from './speciesService';

const initialState = {
  species: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};
export const getSpecies = createAsyncThunk(
  'supplier/get-speices',
  async (_, thunkAPI) => {
    try {
      return await speciesService.getSpecies();
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
export const getOneSpecies = createAsyncThunk(
  'species/get-aspeices',
  async (id, thunkAPI) => {
    try {
      // get token from user
      const token = thunkAPI.getState().supplier.supplier.token;
      return await speciesService.getOneSpecies(id, token);
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
export const createSpecies = createAsyncThunk(
  'species/create-speices',
  async (data, thunkAPI) => {
    try {
      // get token from user
      const token = thunkAPI.getState().supplier.supplier.token;
      return await speciesService.createSpecies(data, token);
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
export const updateSpecies = createAsyncThunk(
  '/update-speices',
  async (inputData, thunkAPI) => {
    console.log(inputData);
    try {
      // get token from user
      const token = thunkAPI.getState().supplier.supplier.token;
      return await speciesService.updateSpecies(inputData, token);
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
//Delete species

export const deleteSpecies = createAsyncThunk(
  'species/delete',
  async (id, thunkAPI) => {
    try {
      // get token from user
      const token = thunkAPI.getState().supplier.supplier.token;
      return await speciesService.deleteSpecies(id, token);
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

export const speciesSlice = createSlice({
  name: 'species',
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
      .addCase(createSpecies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSpecies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdSpecies = action.payload;
      })
      .addCase(createSpecies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getSpecies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSpecies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.species = action.payload;
      })
      .addCase(getSpecies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteSpecies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSpecies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedSpecies = action.payload;
      })
      .addCase(deleteSpecies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOneSpecies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneSpecies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.speciesName = action.payload.species;
        state.speciesDesc = action.payload.description;
      })
      .addCase(getOneSpecies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = false;
        state.message = action.payload;
      })
      .addCase(updateSpecies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSpecies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedSpeciesName = action.payload;
        state.updatedSpeciesDesc = action.payload;
      })
      .addCase(updateSpecies.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      });
  },
});
export const { reset } = speciesSlice.actions;

export default speciesSlice.reducer;
