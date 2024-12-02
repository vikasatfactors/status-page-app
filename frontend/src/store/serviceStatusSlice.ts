import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServiceStatusState {
  serviceStatus: string;  // 'operational' | 'degraded' | 'partial_outage' | 'major_outage'
}

const initialState: ServiceStatusState = {
  serviceStatus: 'operational',
};

const serviceStatusSlice = createSlice({
  name: 'serviceStatus',
  initialState,
  reducers: {
    setServiceStatus(state, action: PayloadAction<string>) {
      state.serviceStatus = action.payload;
    },
  },
});

export const { setServiceStatus } = serviceStatusSlice.actions;
export default serviceStatusSlice.reducer;
