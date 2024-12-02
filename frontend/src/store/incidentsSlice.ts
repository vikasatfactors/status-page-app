// src/store/incidentsSlice.ts
import { Incident } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IncidentsState {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}

const initialState: IncidentsState = {
  incidents: [],
  loading: false,
  error: null,
};

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
    },
    setIncidents(state, action: PayloadAction<Incident[]>) {
      state.incidents = action.payload;
      state.loading = false;
    },
    addIncident(state, action: PayloadAction<Incident>) {
      state.incidents.push(action.payload);
    },
    updateIncident(state, action: PayloadAction<Incident>) {
      const index = state.incidents.findIndex((incident) => incident.id === action.payload.id);
      if (index !== -1) {
        state.incidents[index] = action.payload;
      }
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setIncidents, addIncident, updateIncident, setError } = incidentsSlice.actions;
export default incidentsSlice.reducer;
