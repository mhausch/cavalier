import React, { PropTypes } from 'react';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    render() {
        return (<div>
            <form method="post" action="/cavalier/api/login" >
                <input type="text" name="username" placeholder="username" />
                <input type="text" name="password" placeholder="password" />
                <button type="submit">Login</button>
            </form>
        </div>);
    }
}

Login.propTypes = {
    hello: PropTypes.string,
};
