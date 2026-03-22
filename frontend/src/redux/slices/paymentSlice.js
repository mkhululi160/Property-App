import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
  clientSecret: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
    },
    addPayment: (state, action) => {
      state.payments.unshift(action.payload);
    },
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearClientSecret: (state) => {
      state.clientSecret = null;
    },
  },
});

export const {
  setPayments,
  setCurrentPayment,
  setClientSecret,
  addPayment,
  updatePayment,
  setLoading,
  setError,
  clearClientSecret,
} = paymentSlice.actions;

export default paymentSlice.reducer;