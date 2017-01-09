import React, { PropTypes } from 'react';
import fetch from './../../lib/rest';
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

        // get access_token
        const token = window.localStorage.getItem('cav_token');

        if (token) {
            // fetch.launch(token, (response) => {
            //     console.log(response);
            // });
           // window.location.href = '/?access_token=' + encodeURI(token);
           window.location.href = '/cavalier/private/?cav_token=' + encodeURI(token);
        } else {

        }

        // method binding
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
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
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="bx hz32">
                                <CInput
                                    type="text"
                                    name="username"
                                    placeholder="username"
                                    value={this.state.username}
                                    onChange={this.handleUsernameChange}
                                    noBorderBot={true}
                                />
                                <CInput
                                    type="text"
                                    name="password"
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-4">
                            <div className="bx">
                                <CButton onClick={this.handleButtonClick} value="Login" />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <div className="bx">
                                <CButton onClick={this.handleButtonClick} type="clean" value="help" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handleButtonClick(event) {
        // show spinner
        this.setState({ waiting: true });

        // login
        fetch.login(this.state.username, this.state.password, (response) => {
            if (response && response.data && response.data.token) {
                // save storage for the future
                window.localStorage.setItem('cav_token', response.data.token);
                //fetch.launch(response.data.token, (response) => {
                  //  console.log(response);
                //});

                window.location.href = '/cavalier/private/?cav_token=' + encodeURI(response.data.token);

                // let req = new XMLHttpRequest();
                // req.open('GET', '/cavalier/private', true);
                // req.setRequestHeader('Authorization', 'JWT ' + response.data.token);

                // req.send(null);

                this.setState({ waiting: false });
            } else {
                // delete cache
                window.localStorage.removeItem('access_token');
            }
        });
       // event.preventDefault();
    }

    render() {
        return this.getContent();
    }
}

Login.propTypes = {
    hello: PropTypes.string,
};
