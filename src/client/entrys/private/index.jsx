import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Application from './application';
import logger from '../../middlewares/socket_middleware';
import reducers from './reducer';

const store = createStore(reducers, applyMiddleware(logger));


// Render Login
ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('root'),
);


// Render Login
// ReactDOM.render(<Application />, document.getElementById('root'));

