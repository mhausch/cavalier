
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import Login from '../../client/login';
import Application from '../../client/application';
import Notfound404 from '../../client/notfound404';

const INDEX = '/';
const CAVALIER = '/cavalier/pub/client';

const checkAuth = (nextState, replace) => {
    replace({
        pathname: INDEX,
    });
};

export default render((
    <Router history={browserHistory}>
        <Route path={INDEX} component={Login} />
        <Route path={CAVALIER} component={Application} onEnter={checkAuth} />
        <Route path="*" component={Notfound404} />
    </Router>
), document.getElementById('root'));
