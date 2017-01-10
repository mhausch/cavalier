import React from 'react';

require('./button.scss');

export default class CButton extends React.Component {
    constructor(props) {
        super(props);
    }

    getClassName() {
        let cls = 'button';


        if (this.props.type) {
            cls = cls + ' ' + this.props.type;
        } else {
            cls = cls + ' default';
        }

        if (this.props.size) {
            cls = cls + ' ' + this.props.size;
        }

        if (this.props.width) {
            cls = cls + ' ' + this.props.width;
        }

        cls = cls.replace(/\s\s+/g, ' ');
        return cls;
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
