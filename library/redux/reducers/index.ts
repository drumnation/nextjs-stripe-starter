import { combineReducers } from '@reduxjs/toolkit';

// Import your individual reducers here
// For example:
// import userReducer from './userReducer';
// import postReducer from './postReducer';

const rootReducer = combineReducers({
  // Add your reducers here
  // For example:
  // user: userReducer,
  // posts: postReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
