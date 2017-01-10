import React, { PropTypes } from 'react';
import { Translate, I18n } from 'react-redux-i18n';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n';


import CButton from '../../components/button/button';
import CInput from '../../components/input/input';


require('./../../sass/login.scss');

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            waiting: false,
        };

        // method binding
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleButton2Click = this.handleButton2Click.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handleButtonClick(event) {
        this.setState({ waiting: true });
       // event.preventDefault();
    }

    handleButton2Click(event) {
        console.log(Translate);
        I18n.setLocale('en');
        this.forceUpdate();
       // event.preventDefault();
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
                                    <Translate value="username" />
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
                                    <CButton onClick={this.handleButtonClick} buttontype={true} value={I18n.t('login')} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4">
                                <div className="bx">
                                    <CButton onClick={this.handleButton2Click} type="clean" value={I18n.t('selectLanguage')} />
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

Login.propTypes = {
    hello: PropTypes.string,
};
