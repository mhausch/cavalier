// Import React
import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n';

// Custom import
import Login from './login';
import DE from './de';
import EN from './en';

// check if languange preference is saved
let language = window.localStorage.getItem('cavalier_langu');

// if no preference we set browser language
if (!language) {
    language = window.navigator.language || window.navigator.userLanguage;
}

// create store
const store = createStore(
    combineReducers({
        i18n: i18nReducer,
    }),
    applyMiddleware(thunk),
);
syncTranslationWithStore(store);
store.dispatch(loadTranslations({ en: EN, de: DE }));
store.dispatch(setLocale(language));

// Render Login
ReactDOM.render(
    <Provider store={store}>
        <Login />
    </Provider>,
    document.getElementById('root'),
);
