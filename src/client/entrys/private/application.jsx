import React, { PropTypes } from 'react';

require('./sass/index.scss');

export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    render() {
        return <div className="blue">Application</div>;
    }
}

Application.propTypes = {
    hello: PropTypes.string,
};
