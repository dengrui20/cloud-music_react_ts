import { createStore, compose, applyMiddleware, Store } from 'redux'
import reducer from './reducer';
import thunk from 'redux-thunk';

/* eslint-disable */
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  || compose;
/* eslint-disable */


const store: Store  = createStore(reducer,composeEnhancers(applyMiddleware(thunk)))

export default store
