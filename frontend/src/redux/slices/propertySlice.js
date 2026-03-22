import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalProperties: 0,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setProperties: (state, action) => {
      state.properties = action.payload.properties;
      state.totalPages = action.payload.pages;
      state.currentPage = action.payload.page;
      state.totalProperties = action.payload.total;
    },
    setCurrentProperty: (state, action) => {
      state.currentProperty = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProperties,
  setCurrentProperty,
  setLoading,
  setError,
  clearError,
} = propertySlice.actions;

export default propertySlice.reducer;