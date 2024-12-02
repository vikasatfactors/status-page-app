import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
  messages: { message: string; timestamp: string }[];
}

const initialState: WebSocketState = {
  messages: [],
};

const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ message: string; timestamp: string }>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = webSocketSlice.actions;
export default webSocketSlice.reducer;
