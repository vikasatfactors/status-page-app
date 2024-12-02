import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './servicesSlice';
import incidentsReducer from './incidentsSlice';
import serviceStatusReducer from './serviceStatusSlice';
import webSocketReducer from './wsSlice';

const store = configureStore({
  reducer: {
    services: servicesReducer,
    incidents: incidentsReducer,
    serviceStatus: serviceStatusReducer,
    webSocket: webSocketReducer,
    },
});

export default store;
