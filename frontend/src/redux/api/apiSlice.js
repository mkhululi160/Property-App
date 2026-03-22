import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'https://property-app-live.onrender.com/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Property', 'User', 'Booking', 'Payment', 'Review'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getProperties: builder.query({
      query: (params) => ({
        url: '/properties',
        params,
      }),
      providesTags: ['Property'],
    }),
    getPropertyById: builder.query({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    createProperty: builder.mutation({
      query: (formData) => ({
        url: '/properties',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/properties/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Property'],
    }),
    saveProperty: builder.mutation({
      query: (id) => ({
        url: `/auth/save-property/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),
    getMyBookings: builder.query({
      query: () => '/bookings/mybookings',
      providesTags: ['Booking'],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking'],
    }),
    createPaymentIntent: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/create-payment-intent',
        method: 'POST',
        body: paymentData,
      }),
    }),
    confirmPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/confirm',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment', 'Booking'],
    }),
    getPaymentHistory: builder.query({
      query: () => '/payments/history',
      providesTags: ['Payment'],
    }),
    addReview: builder.mutation({
      query: ({ propertyId, reviewData }) => ({
        url: `/reviews/${propertyId}`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Property', id: propertyId },
      ],
    }),
    getReviews: builder.query({
      query: (propertyId) => `/reviews/${propertyId}`,
      providesTags: ['Review'],
    }),
    getPropertiesForMap: builder.query({
      query: (params) => ({
        url: '/properties/map',
        params,
      }),
    }),
    getTopProperties: builder.query({
      query: () => '/properties/top',
      providesTags: ['Property'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useSavePropertyMutation,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useGetPaymentHistoryQuery,
  useAddReviewMutation,
  useGetReviewsQuery,
  useGetPropertiesForMapQuery,
  useGetTopPropertiesQuery,
} = apiSlice;