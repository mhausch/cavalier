import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n';
import Login from './login';

const language = navigator.language || navigator.userLanguage;

const translationsObject = {
    en: {
        login: 'Login',
        username: 'Username',
        password: 'Password',
        selectLanguage: 'Language...',
    },
    de: {
        login: 'Login',
        username: 'Benutzer',
        password: 'Passwort',
        selectLanguage: 'Sprache...',
    },
};

const store = createStore(
    combineReducers({
        i18n: i18nReducer,
    }),
    applyMiddleware(thunk),
);
syncTranslationWithStore(store);
store.dispatch(loadTranslations(translationsObject));
store.dispatch(setLocale(language));

// Render Login
ReactDOM.render(<Login />, document.getElementById('root'));
