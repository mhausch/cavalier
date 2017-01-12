import React from 'react';

require('./docking.scss');

export default class CDocking extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };

        this.clickClose = this.clickClose.bind(this);
    }

    getClassname() {
        let cls = 'docking';

        if (this.state.open || this.props.open) {
            cls = cls + ' show';
        }

        if (this.props.vertical === 'bottom') {
           cls = cls + ' bottom';
        } else {
           cls = cls + ' top';
        }

        if (this.props.horizontal === 'right') {
           cls = cls + ' right';
        } else {
           cls = cls + ' left';
        }

       return cls;
    }

    clickClose() {
        this.setState({ open: false });

        if (this.props.clickClose) {
            this.props.clickClose();
        }
    }

    render() {
        return (<div className={this.getClassname()} >
            {this.props.children}
            <div className="dockingClose" onClick={this.clickClose} >X
            </div>
        </div>
        );
    }
}
