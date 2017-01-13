import React, { PropTypes } from 'react';
import io from 'socket.io-client';

export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    componentDidMount() {
        this.socket = io('/', { path: '/client' });
    }

    handlecl() {
       // this.socket.emit('message', 'gg');
    }

    render() {
        return (<form method="get" action="/logout">
            <div className="blue"><button onClick={this.handlecl.bind(this)} />Application</div>;
        </form>);
    }
}

Application.propTypes = {
    hello: PropTypes.string,
};
