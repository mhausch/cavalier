import React, { PropTypes } from 'react';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    render() {
        return <div>{this.props.hello}</div>;
    }
}

Login.propTypes = {
    hello: PropTypes.string,
};
