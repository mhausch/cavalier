import React from 'react';

require('./button.scss');

export default class CButton extends React.Component {
    constructor(props) {
        super(props);
    }

    getClassName() {
        const cls = [];
        cls.push('button');


        if (this.props.type) {
            cls.push(this.props.type);
        } else {
            cls.push('default');
        }

        if (this.props.size) {
            cls.push(this.props.size);
        }

        if (this.props.width) {
            cls.push(this.props.width);
        }

        return cls.join(' ').replace(/\s\s+/g, ' ');
    }

    getComponent() {
        if (this.props.buttontype) {
            return (<button className={this.getClassName()} onClick={this.props.onClick}>{this.props.value}</button>);
        }

        return (<input type="button" className={this.getClassName()} value={this.props.value} onClick={this.props.onClick} />);
    }

    render() {
        return this.getComponent();
    }
}

CButton.PropTypes = {
    type: React.PropTypes.string,
    buttontype: React.PropTypes.bool,
    value: React.PropTypes.string,
};
