import React, { PropTypes } from 'react';
import axios from 'axios';
import fetch from './lib/rest';


export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            waiting: false,
        };

        // get access_token
        const token = window.localStorage.getItem('access_token');

        if (token) {
            fetch.verify(token, (response) => {
                console.log(response);
            });
        } else {

        };

        // method binding
        this.handleButtonClick = this.handleButtonClick.bind(this);
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
        // show spinner
        this.setState({ waiting: true });

        // login
        fetch.login(this.state.username, this.state.password, (response) => {
            if (response && response.data && response.data.token) {
                // save storage for the future
                window.localStorage.setItem('access_token', response.data.token);
                this.setState({ waiting: false });
            } else {
                // delete cache
                window.localStorage.removeItem('access_token');
            }
        });

        event.preventDefault();
    }

    getContent() {
        if (this.state.waiting) {
            return (<div className="sk-cube-grid">
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
            );
        }

        return (<div>
            <form method="post" action="/cavalier/api/login" >
                <input type="text" name="username" placeholder="username" onChange={this.handleUsernameChange} />
                <input type="text" name="password" placeholder="password" onChange={this.handlePasswordChange} />
                <button type="submit" onClick={this.handleButtonClick}>Login</button>
            </form>
        </div>);
    }

    render() {
        return this.getContent();
    }
}

Login.propTypes = {
    hello: PropTypes.string,
};
