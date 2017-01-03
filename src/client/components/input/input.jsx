import React from 'react';

require('./input.scss');

export default class CInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<input
            className="input"
            type={this.props.type}
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={this.props.onChange}
        />);
    }

}


CInput.PropTypes = {
    type: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
};
