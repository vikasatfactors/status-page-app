import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Service {
  id: string;
  name: string;
  status: string;
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
    },
    setServices(state, action: PayloadAction<Service[]>) {
      state.services = action.payload;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setServices, setError } = servicesSlice.actions;
export default servicesSlice.reducer;
