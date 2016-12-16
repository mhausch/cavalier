
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import Login from '../../client/login';
import Application from '../../client/application';

export default render((
    <Router history={browserHistory}>
        <Route path="/" component={Login} />
        <Route path="/cavalier_client" component={Application} />
    </Router>
), document.getElementById('root'));
