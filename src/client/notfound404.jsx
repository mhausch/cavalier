import React, { PropTypes } from 'react';

export default class Notfound404 extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    render() {
        return <div>Notfound</div>;
    }
}

Notfound404.propTypes = {
    hello: PropTypes.string,
};
