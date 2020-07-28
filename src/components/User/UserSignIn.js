import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import LoggedIn from './LoggedIn';
import Header from '../Styling/Header';

export default class UserSignIn extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user_name : "",
			password : "",
			error : false,
			loginSuccess : false,
			errorMessage : "",
			inTrouble : null,
			data : null,
			token : null
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})
	}

	sha256 = async message => {
		// encode as UTF-8
	    const msgBuffer = new TextEncoder('utf-8').encode(message);                    

	    // hash the message
	    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

	    // convert ArrayBuffer to Array
	    const hashArray = Array.from(new Uint8Array(hashBuffer));

	    // convert bytes to hex string                  
	    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
	    return hashHex;	
	}

	onSubmit = async e => {
		const data = {
			user_name : this.state.user_name,
			password : this.state.password
		};

		data.password = await this.sha256(data.user_name + data.password);
		
		var res;
		
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/user/login', data)
		.then(response => {
			//console.log(response);
			res = response.status;
			this.setState({
				inTrouble : response.data.inTrouble,
				data : response.data,
				token : response.data.token
			});
		})
		.catch(error => {
			//console.log(error.response);
			this.setState({
				password: ""
			});
		});
		
		if(res === 200) {
			//console.log("IN");
				this.setState({
				loginSuccess : true
				});
		} else {
			//console.log("1234")
			this.setState({
				errorMessage: "Username or password is incorrect",
				password: ""
			});
		}
	
	}

	componentWillMount() {
		localStorage.setItem('session_start', null);	
	}

	render() {

		const { loginSuccess, error } = this.state;
		if (this.state.loginSuccess == true) {
			localStorage.setItem('session', "start");
			localStorage.setItem('user_name', this.state.user_name);
			localStorage.setItem('token', this.state.token);
			return <Redirect push to  = {{ 
					pathname : '/LoggedIn',
            		state : { data : this.state.data, user_name : this.state.user_name, 
            			inTrouble : this.state.inTrouble, token : this.state.token}
            }}
			/>;
		}

		return (
			<div>
			<Header />
 			<center>
				<div className="jumbotron shadow-lg login-jumbotron">
					<h2>USER <span className="change-color">LOGIN</span> </h2>
					<hr />
					<form onSubmit = {this.handleSubmit} className="login-form">
					<div className="form-group">
						<div class="input-group mb-2">
							<div class="input-group-prepend">
								<div class="input-group-text">
									<FontAwesomeIcon icon={faUser} size="2x" />
								</div>
							</div>
							<input type="text" className="form-control" value={this.state.user_name} name="user_name" placeholder="Username" id="username" onChange={this.handleChange} required/>
						</div>
					</div>

					<div className="form-group">
						<div class="input-group mb-2">
							<div class="input-group-prepend">
								<div class="input-group-text">
									<FontAwesomeIcon icon={faLock} size="2x" />
								</div>
							</div>
							<input type="password" className="form-control" name="password" id="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} required/>
						</div>
					</div>

					<h4><span className="errorMessage">{this.state.errorMessage}</span></h4>

						<br/><br/>
						<center> <button type="button" onClick={this.onSubmit} className="btn btn-primary btn-lg">LOGIN</button><br/><br/>
						<h4>Not a user ?<Link to = "/UserSignUp" className="change-color link"> SignUp </Link></h4></center>
								
					</form>
				</div>
				</center>
			</div>
		)

	}
}
