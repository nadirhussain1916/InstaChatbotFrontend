import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatMessages: [],
  isTyping: false,
  streamingMessageId: null,
  showGreeting: true,
  savedThreadId: '',
  selectedContentType: '',
  anchorEl: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    
    setMessages: (state, action) => {
      state.chatMessages = action.payload;
    },
    
    clearMessages: state => {
      state.chatMessages = [];
    },
    
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    
    setStreamingMessageId: (state, action) => {
      state.streamingMessageId = action.payload;
    },
    
    setShowGreeting: (state, action) => {
      state.showGreeting = action.payload;
    },
    
    setSavedThreadId: (state, action) => {
      state.savedThreadId = action.payload;
    },
    
    setSelectedContentType: (state, action) => {
      state.selectedContentType = action.payload;
    },
    
    setAnchorEl: (state, action) => {
      state.anchorEl = action.payload;
    },
    
    addMultipleMessages: (state, action) => {
      state.chatMessages.push(...action.payload);
    },
    
    resetChat: state => {
      return {
        ...initialState,
        savedThreadId: state.savedThreadId, // Keep thread ID when resetting
      };
    },
    
    resetChatCompletely: () => {
      return { ...initialState };
    },
  },
});

export const {
  addMessage,
  setMessages,
  clearMessages,
  setIsTyping,
  setStreamingMessageId,
  setShowGreeting,
  setSavedThreadId,
  setSelectedContentType,
  setAnchorEl,
  addMultipleMessages,
  resetChat,
  resetChatCompletely,
} = chatSlice.actions;

export default chatSlice.reducer;
