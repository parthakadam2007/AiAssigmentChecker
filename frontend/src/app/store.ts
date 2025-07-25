import {configureStore }  from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import sharedSlice from '../shared/slices/sharedSlice'

export const store = configureStore ({
  reducer: {
    // Add your slice reducers here
    auth:authReducer,
    shared:sharedSlice
  }
} )