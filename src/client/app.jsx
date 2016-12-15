import React, { PropTypes } from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    render() {
        return <div>{this.props.hello}</div>;
    }
}

App.propTypes = {
    hello: PropTypes.string,
};
