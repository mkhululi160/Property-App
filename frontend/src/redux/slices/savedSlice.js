import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savedProperties: [],
  loading: false,
  error: null,
};

const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    setSavedProperties: (state, action) => {
      state.savedProperties = action.payload;
    },
    addSavedProperty: (state, action) => {
      state.savedProperties.push(action.payload);
    },
    removeSavedProperty: (state, action) => {
      state.savedProperties = state.savedProperties.filter(
        p => p._id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSavedProperties,
  addSavedProperty,
  removeSavedProperty,
  setLoading,
  setError,
} = savedSlice.actions;

export default savedSlice.reducer;