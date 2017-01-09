import React, { PropTypes } from 'react';
import io from 'socket.io-client';

export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    componentDidMount() {
        this.socket = io.connect('/');
        this.socket.emit('message', '');
        console.log(this.socket.name);
    }

    handlecl() {
        this.socket.emit('message', 'gg');
    }

    render() {
        return <div className="blue"><input type="button" onClick={this.handlecl.bind(this)} />Application</div>;
    }
}

Application.propTypes = {
    hello: PropTypes.string,
};
