
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import Login from '../../client/login';

export default render((
    <Router history={browserHistory}>
        <Route path="/" component={Login} />
        <Route path="/log" component={Login} />
    </Router>
), document.getElementById('root'));
