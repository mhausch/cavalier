// Import Modules
import React, { PropTypes } from 'react';
import { setLocale, I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';

// Custom Imports
import CButton from '../../components/button/button';
import CInput from '../../components/input/input';

// Sass integration
require('./../../sass/login.scss');

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            waiting: false,
        };

        // method binding
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLanguClick = this.handleLanguClick.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handleLoginClick(event) {
        // Show spinner
        this.setState({ waiting: true });
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
                                        noBorderBot={true}
                                    />
                                    <CInput
                                        type="text"
                                        name="password"
                                        placeholder={I18n.t('password')}
                                        value={this.state.password}
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
