import React, { PropTypes } from 'react';

export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    render() {
        return <div>Application</div>;
    }
}

Application.propTypes = {
    hello: PropTypes.string,
};
