// Import Modules
import React, { PropTypes } from 'react';
import { setLocale, I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';

// Custom Imports
import CButton from '../../components/button/button';
import CInput from '../../components/input/input';
import CDocking from '../../components/docking/docking';

// Sass integration
require('./../../sass/login.scss');

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            waiting: false,
            error: false,
            errorMsg: '',
            docking: true,
        };

        // method binding
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLanguClick = this.handleLanguClick.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handleFocus() {
        this.setState({ error: false });
    }

    handleLoginClick(event) {
        // Show spinner
        this.setState({ waiting: true });

        const credentials = {
            username: this.state.username,
            password: this.state.password,
        };

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                console.log('Passing user');
            } else {
                if (httpRequest.status === 400) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.setState({ waiting: false });
                    this.setState({ error: true });
                    this.setState({ errorMsg: I18n.t('missingCredentials') });
                } else if (httpRequest.status === 401) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.setState({ waiting: false });
                    this.setState({ error: true });
                    this.setState({ errorMsg: I18n.t('invalidCredentials') });
                }
            }
        };
        httpRequest.open('POST', '/api/login', false);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(JSON.stringify(credentials));
    }

    handleLanguClick(event) {
        // When locale EN, switch to DE else to EN
        const locale = I18n._getLocale() === 'en' ? 'de' : 'en';

        window.localStorage.setItem('cavalier_langu', locale);

        // Refresh store
        this.props.dispatch(setLocale(locale));

        // Refresh placeholders
        this.forceUpdate();
    }

    getError() {
        if (this.state.error) {
            return (<div className="row">
                <div className="col-xs-12">
                    <label>{this.state.errorMsg}</label>
                </div>
            </div>
            );
        }
        return null;
    }

    cli() {
        this.setState({ docking: false });
    }

    getContent() {
        if (this.state.waiting) {
            return (<div className="overlay">
                <div className="sk-cube-grid">
                    <div className="sk-cube sk-cube1" />
                    <div className="sk-cube sk-cube2" />
                    <div className="sk-cube sk-cube3" />
                    <div className="sk-cube sk-cube4" />
                    <div className="sk-cube sk-cube5" />
                    <div className="sk-cube sk-cube6" />
                    <div className="sk-cube sk-cube7" />
                    <div className="sk-cube sk-cube8" />
                    <div className="sk-cube sk-cube9" />
                </div>
            </div>
            );
        }

        return (<div className="container">
            <CDocking open={this.state.docking} clickClose={this.cli.bind(this)} />
            <div className="row center-md">
                <div className="col-xs-12 col-sm-8 col-lg-3">
                    <form method="post" action="/login">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="bx hz32">
                                    <CInput
                                        type="text"
                                        name="username"
                                        placeholder={I18n.t('username')}
                                        value={this.state.username}
                                        onChange={this.handleUsernameChange}
                                        onFocus={this.handleFocus}
                                        noBorderBot={true}
                                    />
                                    <CInput
                                        type="text"
                                        name="password"
                                        placeholder={I18n.t('password')}
                                        value={this.state.password}
                                        onFocus={this.handleFocus}
                                        onChange={this.handlePasswordChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-4">
                                <div className="bx">
                                    <CButton onClick={this.handleLoginClick} buttontype={true} value={I18n.t('login')} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4">
                                <div className="bx">
                                    <CButton onClick={this.handleLanguClick} type="clean" value={I18n.t('selectLanguage')} />
                                </div>
                            </div>
                        </div>
                        {this.getError()}
                    </form>
                </div>
            </div>
        </div>);
    }

    render() {
        return this.getContent();
    }
}

// Connect Redux to Component
export default connect()(Login);
