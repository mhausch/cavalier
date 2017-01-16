import React, { PropTypes } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const types = {};
types.COMPLETE_ALL = 'all';
const completeAll = () => ({ type: types.COMPLETE_ALL });

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hello: 'some' };
    }

    componentDidMount() {
        this.socket = io('/', { path: '/client' });
        this.socket.emit('message2', 'gg');
    }

    handlecl() {
       this.socket.emit('message', 'gg');
       this.props.reset();
    }

    render() {
        // return (<form method="get" action="/logout">
            return (<div className="blue"><button onClick={this.handlecl.bind(this)} />Application</div>);
        // </form>);
    }
}

Application.propTypes = {
    hello: PropTypes.string,
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    reset: bindActionCreators(completeAll, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);
