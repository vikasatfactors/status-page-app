// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './servicesSlice';
import incidentsReducer from './incidentsSlice';
import serviceStatusReducer from './serviceStatusSlice';

const store = configureStore({
  reducer: {
    services: servicesReducer,
    incidents: incidentsReducer,
    serviceStatus: serviceStatusReducer,
  },
});

export default store;
