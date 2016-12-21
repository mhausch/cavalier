
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import Login from '../../client/login';
import Application from '../../client/application';
import Notfound404 from '../../client/notfound404';

const INDEX = '/';
const CAVALIER_PUB = '/cavalier/public';
const CAVALIER_PRI = '/cavalier/private';

const checkAuth = (nextState, replace) => {
    replace({
        pathname: INDEX,
    });
};

const checkIsLogged = (nextState, replace) => {
    if (window.localStorage.getItem('access_token')) {
        browserHistory.goForward('/cavalier/private');
    } else {

    };

};

export default render((
    <Router history={browserHistory}>
        <Route path={INDEX} component={Login} onEnter={checkIsLogged}>
            <Route path={CAVALIER_PUB} component={Application} onEnter={checkAuth} />
            <Route path={CAVALIER_PRI} component={Application} />
        </Route>
        <Route path="*" component={Notfound404} />
    </Router>
), document.getElementById('root'));
