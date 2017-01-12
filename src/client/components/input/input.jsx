import React from 'react';

require('./input.scss');

export default class CInput extends React.Component {
    constructor(props) {
        super(props);
    }

    getClassName() {
        let cls = 'input';

        if (this.props.noBorderBot) {
            cls = cls + ' no-border-bot';
        }

        if (this.props.noBorder) {
            cls = cls + ' no-border';
        }

        return cls;
    }

    render() {
        return (<input
            className={this.getClassName()}
            type={this.props.type}
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            name={this.props.name}
        />);
    }

}


CInput.PropTypes = {
    type: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
};
