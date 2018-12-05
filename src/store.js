import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { sessionReducer } from 'redux-react-session';
import thunkMiddleware from 'redux-thunk';

// Add the sessionReducer
const reducer = combineReducers({
    session: sessionReducer
});
const store = createStore(reducer, undefined, compose(applyMiddleware(thunkMiddleware)));
export default store;
