/**
defines the redux store. Contains the reducers for socket state and messages state
*/

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import socketReducer from './socket/reducer';
import messageReducer from './message/reducer';
import socketMiddleware from './socket/middleware';
import userReducer from './user/reducer';

const rootReducer = combineReducers({
  socketState: socketReducer,
  messageState: messageReducer,
  userState: userReducer
});

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const index = {
  ...createStore(rootReducer, composeEnhancers(applyMiddleware(socketMiddleware)))
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof index.getState>
// Inferred type: {socketState: PostsState, messageState: CommentsState, userState: UsersState}
export type AppDispatch = typeof index.dispatch

export default index;